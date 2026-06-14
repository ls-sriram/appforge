import { state } from './state.js';
import { api } from './api.js';
import { el, setStatus } from './utils.js';
import {
  setMode,
  applyCodeWrapState,
  getCurrentFile,
  renderQueue,
  renderFileView,
  renderChange,
  updateFlagSummary,
  renderDecisionButtons,
  setRenderHandlers,
} from './render.js';

export async function loadQueue() {
  const data = await api('/api/changes');
  state.changes = data.changes;
  renderQueue();
  if (!state.activeChangeId && state.changes.length > 0) await selectChange(state.changes[0].change_id);
}

export async function selectChange(changeId) {
  state.activeChangeId = changeId;
  state.activeFileIndex = 0;
  state.selectedDecision = null;
  state.flagged = {};
  state.activeChange = await api(`/api/changes/${changeId}`);

  const review = state.activeChange?.review || null;
  if (review && review.flagged && typeof review.flagged === 'object') {
    state.flagged = { ...review.flagged };
  } else {
    for (const item of state.activeChange?.comments?.comments || []) {
      if (!item.file || !item.text) continue;
      state.flagged[item.file] = { comment: item.text };
    }
  }

  if (review?.decision) {
    state.selectedDecision = review.decision;
  }

  if (review?.mode === 'summary' || review?.mode === 'file') {
    setMode(review.mode);
  }

  for (const item of state.activeChange?.comments?.comments || []) {
    if (!item.file || !item.text) continue;
    if (!state.flagged[item.file]) {
      state.flagged[item.file] = { comment: item.text };
    }
  }
  renderQueue();
  renderChange();
}

function openFlagInline() {
  const current = getCurrentFile();
  if (!current) return;
  el('flag-file-name').textContent = current.file;
  el('flag-comment').value = state.flagged[current.file]?.comment || '';
  const saveBtn = el('save-flag-btn');
  saveBtn.classList.toggle('btn-flagged', Boolean(state.flagged[current.file]?.comment));
  el('flag-inline').classList.remove('hidden');
}

function setupVoiceTyping() {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return false;
  state.speechRec = {
    forFlag: new Ctor(),
    forRerun: new Ctor(),
  };
  for (const rec of [state.speechRec.forFlag, state.speechRec.forRerun]) {
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
  }
  state.speechRec.forFlag.onresult = (e) => {
    const txt = e.results?.[0]?.[0]?.transcript || '';
    el('flag-comment').value = `${el('flag-comment').value} ${txt}`.trim();
  };
  state.speechRec.forRerun.onresult = (e) => {
    const txt = e.results?.[0]?.[0]?.transcript || '';
    el('rerun-reason').value = `${el('rerun-reason').value} ${txt}`.trim();
  };
  return true;
}

async function saveFlag() {
  const current = getCurrentFile();
  if (!current) return;
  const comment = el('flag-comment').value.trim();
  if (!comment) return;
  state.flagged[current.file] = { comment };
  await api(`/api/changes/${state.activeChangeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ file: current.file, text: comment }),
  });
  el('flag-inline').classList.add('hidden');
  const saveBtn = el('save-flag-btn');
  saveBtn.classList.add('btn-flagged');
  renderFileView();
}

function openRerunInline() {
  const entries = Object.entries(state.flagged);
  const list = el('rerun-flag-list');
  list.innerHTML = '';
  for (const [file, info] of entries) {
    const li = document.createElement('li');
    li.className = 'comment-item';
    li.innerHTML = `<div class="where">${file}</div><div>${info.comment}</div>`;
    list.appendChild(li);
  }
  el('rerun-inline').classList.remove('hidden');
}

async function confirmRerun() {
  const entries = Object.entries(state.flagged);
  if (!entries.length) return;
  const flagged_files = entries.map(([file]) => file);
  const reason = el('rerun-reason').value || null;

  await api(`/api/changes/${state.activeChangeId}/decision`, {
    method: 'POST',
    body: JSON.stringify({ status: 'needs-rerun', note: reason, flagged_files, instructions: [], constraints: [] }),
  });
  el('rerun-inline').classList.add('hidden');
  await loadQueue();
  await selectChange(state.activeChangeId);
}

function toggleApprove() {
  state.selectedDecision = state.selectedDecision === 'approved' ? null : 'approved';
  renderDecisionButtons();
  updateFlagSummary();
}

async function saveReview() {
  if (!state.activeChangeId) return;
  const payload = {
    flagged: state.flagged,
    mode: state.mode,
    decision: state.selectedDecision,
    savedAt: new Date().toISOString(),
  };
  await api(`/api/changes/${state.activeChangeId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (state.selectedDecision === 'approved') {
    await api(`/api/changes/${state.activeChangeId}/decision`, { method: 'POST', body: JSON.stringify({ status: 'approved' }) });
    await loadQueue();
    await selectChange(state.activeChangeId);
  }
  setStatus('Review saved');
}

export function hookEvents() {
  setRenderHandlers({ onSelectChange: selectChange });

  el('tab-summary').onclick = () => setMode('summary');
  el('tab-file').onclick = () => setMode('file');
  el('toggle-queue').onclick = () => document.querySelector('.layout').classList.toggle('queue-collapsed');
  el('toggle-wrap').onclick = () => {
    state.wrapCode = !state.wrapCode;
    applyCodeWrapState();
  };
  el('toggle-full-file').onclick = () => {
    state.fullFileView = !state.fullFileView;
    el('toggle-full-file').textContent = state.fullFileView ? '⤢ Diff only' : '⤢ Expand file';
    renderFileView();
  };
  el('prev-file').onclick = () => {
    state.activeFileIndex = Math.max(0, state.activeFileIndex - 1);
    renderFileView();
  };
  el('next-file').onclick = () => {
    const max = Math.max(0, (state.activeChange?.files || []).length - 1);
    state.activeFileIndex = Math.min(max, state.activeFileIndex + 1);
    renderFileView();
  };

  el('flag-file').onclick = openFlagInline;
  el('save-flag-btn').onclick = saveFlag;
  el('cancel-flag-btn').onclick = () => el('flag-inline').classList.add('hidden');
  el('flag-comment').oninput = () => el('save-flag-btn').classList.remove('btn-flagged');

  el('rerun-btn').onclick = () => {
    if (state.selectedDecision === 'needs-rerun') {
      state.selectedDecision = null;
      el('rerun-inline').classList.add('hidden');
      renderDecisionButtons();
      updateFlagSummary();
      return;
    }
    state.selectedDecision = 'needs-rerun';
    renderDecisionButtons();
    updateFlagSummary();
    openRerunInline();
  };

  el('save-review-btn').onclick = saveReview;
  el('cancel-rerun-btn').onclick = () => {
    state.selectedDecision = null;
    el('rerun-inline').classList.add('hidden');
    renderDecisionButtons();
    updateFlagSummary();
  };
  el('confirm-rerun-btn').onclick = confirmRerun;
  el('accept-btn').onclick = toggleApprove;

  const voiceBtn = el('voice-btn');
  const rerunVoiceBtn = el('rerun-voice-btn');
  if (setupVoiceTyping()) {
    voiceBtn.onclick = () => state.speechRec.forFlag.start();
    rerunVoiceBtn.onclick = () => state.speechRec.forRerun.start();
  } else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = 'Voice unavailable';
    rerunVoiceBtn.disabled = true;
    rerunVoiceBtn.textContent = 'Voice unavailable';
  }
}
