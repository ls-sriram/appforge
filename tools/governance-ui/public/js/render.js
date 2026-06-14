import { state } from './state.js';
import { api } from './api.js';
import { el, escapeHtml, statusClass } from './utils.js';

let onSelectChange = () => {};

export function setRenderHandlers(handlers) {
  onSelectChange = handlers.onSelectChange;
}

export function setMode(mode) {
  state.mode = mode;
  el('summary-view').classList.toggle('hidden', mode !== 'summary');
  el('file-view').classList.toggle('hidden', mode !== 'file');
  el('tab-summary').classList.toggle('active', mode === 'summary');
  el('tab-file').classList.toggle('active', mode === 'file');
}

export function applyCodeWrapState() {
  el('before-diff').classList.toggle('wrap', state.wrapCode);
  el('after-diff').classList.toggle('wrap', state.wrapCode);
  el('toggle-wrap').textContent = `↩ Wrap: ${state.wrapCode ? 'on' : 'off'}`;
}

export function getCurrentFile() {
  return (state.activeChange?.files || [])[state.activeFileIndex] || null;
}

export function renderQueue() {
  const list = el('change-list');
  list.innerHTML = '';
  for (const change of state.changes) {
    const li = document.createElement('li');
    li.innerHTML = `<div>${change.change_id}</div><div class="${statusClass(change.status)}">${change.status}</div>`;
    if (change.change_id === state.activeChangeId) li.classList.add('active');
    li.onclick = () => onSelectChange(change.change_id);
    list.appendChild(li);
  }
}

function renderDiffPane(fileData, side) {
  const rows = [`<div class="diff-line diff-header"><span class="mark"> </span><span class="content">${escapeHtml(fileData.file || '')}</span></div>`];
  for (const raw of fileData.lines || []) {
    const type = raw.startsWith('+') ? 'add' : raw.startsWith('-') ? 'del' : 'ctx';
    const content = type === 'ctx' ? (raw.startsWith(' ') ? raw.slice(1) : raw) : raw.slice(1);
    if (side === 'before') {
      if (type === 'add') rows.push('<div class="diff-line diff-empty"><span class="mark"> </span><span class="content"></span></div>');
      else rows.push(`<div class="diff-line diff-${type}"><span class="mark">${type === 'del' ? '-' : ' '}</span><span class="content">${escapeHtml(content)}</span></div>`);
    } else if (type === 'del') {
      rows.push('<div class="diff-line diff-empty"><span class="mark"> </span><span class="content"></span></div>');
    } else {
      rows.push(`<div class="diff-line diff-${type}"><span class="mark">${type === 'add' ? '+' : ' '}</span><span class="content">${escapeHtml(content)}</span></div>`);
    }
  }
  return rows.join('');
}

function renderIssueList(items, target) {
  const list = el(target);
  list.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.className = `issue-item ${item.severity || 'medium'}`;
    li.innerHTML = `<div class="issue-head"><span class="issue-icon ${item.severity || 'medium'}">${(item.severity || 'medium').slice(0,1).toUpperCase()}</span><span class="issue-desc">${escapeHtml(item.description)}</span></div>`;
    list.appendChild(li);
  }
}

function renderSummaryView() {
  const change = state.activeChange;
  const fileCount = change.files?.length || 0;
  const riskCount = change.issues?.issues?.length || 0;
  const fallback = `Change touches ${fileCount} file${fileCount === 1 ? '' : 's'} with ${riskCount} issue signal${riskCount === 1 ? '' : 's'}.`;
  el('change-summary').textContent = change.agent?.summary || fallback;

  const affected = el('affected-list');
  affected.innerHTML = '';
  const affectedFiles = change.semantic?.affected_files || [];
  const maybeAffected = change.semantic?.potentially_affected || [];
  [...affectedFiles, ...maybeAffected.map((x) => `possibly -> ${x}`)].forEach((item) => {
    const li = document.createElement('li');
    li.className = 'comment-item';
    li.textContent = item;
    affected.appendChild(li);
  });

  renderIssueList(change.issues?.issues || [], 'overall-issues-list');
}

export async function renderFileView() {
  const current = getCurrentFile();
  const files = state.activeChange?.files || [];
  el('file-position').textContent = files.length ? `${state.activeFileIndex + 1} / ${files.length}` : '0 / 0';
  if (!current) return;

  if (state.fullFileView) {
    try {
      const data = await api(`/api/changes/${state.activeChangeId}/file?path=${encodeURIComponent(current.file)}`);
      const full = escapeHtml(data.content || '');
      el('before-diff').innerHTML = `<div class="diff-line diff-header"><span class="mark"> </span><span class="content">${escapeHtml(current.file)} (full file)</span></div><div class="diff-line diff-ctx"><span class="mark"> </span><span class="content">${full}</span></div>`;
      el('after-diff').innerHTML = el('before-diff').innerHTML;
    } catch {
      el('before-diff').innerHTML = renderDiffPane(current, 'before');
      el('after-diff').innerHTML = renderDiffPane(current, 'after');
    }
  } else {
    el('before-diff').innerHTML = renderDiffPane(current, 'before');
    el('after-diff').innerHTML = renderDiffPane(current, 'after');
  }
  applyCodeWrapState();

  const impact = el('file-impact-list');
  impact.innerHTML = '';
  const fileImpact = state.activeChange?.agent?.file_impact?.[current.file] || [];
  const impactItems = Array.isArray(fileImpact) && fileImpact.length > 0 ? fileImpact : ['No file impact provided by agent.'];
  impactItems.forEach((i) => {
    const li = document.createElement('li');
    li.className = 'impact-item';
    li.textContent = i;
    impact.appendChild(li);
  });

  const fileIssues = state.activeChange?.agent?.file_issues?.[current.file];
  const issues = Array.isArray(fileIssues) && fileIssues.length > 0
    ? fileIssues
    : [{ severity: 'low', description: 'No file-specific issues provided by agent.' }];
  renderIssueList(issues, 'file-issues-list');

  const flagged = state.flagged[current.file];
  const flagBtn = el('flag-file');
  flagBtn.textContent = '🚩 Flag';
  flagBtn.classList.toggle('btn-flagged', Boolean(flagged));

  updateFlagSummary();
}

export function updateFlagSummary() {
  const entries = Object.entries(state.flagged);
  const decision = state.selectedDecision ? ` | decision: ${state.selectedDecision}` : '';
  el('flag-summary').textContent = entries.length ? `${entries.length} file${entries.length === 1 ? '' : 's'} flagged${decision}` : `No files flagged${decision}`;
}

export function renderDecisionButtons() {
  el('accept-btn').classList.toggle('btn-selected', state.selectedDecision === 'approved');
  el('rerun-btn').classList.toggle('btn-selected', state.selectedDecision === 'needs-rerun');
  const decisionState = el('decision-state');
  decisionState.textContent = `Decision: ${state.selectedDecision || 'none'}`;
  decisionState.className = statusClass(state.selectedDecision || 'pending');
}

export function renderChange() {
  const status = state.activeChange?.decision?.status || 'pending';
  el('change-title').textContent = state.activeChange?.change_id || 'Select a change';
  el('change-status').textContent = `Status: ${status}`;
  el('active-status-pill').className = statusClass(status);
  el('active-status-pill').textContent = status;
  renderSummaryView();
  renderFileView();
  renderDecisionButtons();
}
