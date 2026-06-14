export const el = (id) => document.getElementById(id);

export function statusClass(status) {
  if (status === 'approved') return 'pill pill-approved';
  if (status === 'needs-rerun') return 'pill pill-rerun';
  if (status === 'rejected') return 'pill pill-rejected';
  return 'pill pill-neutral';
}

export function setStatus(text, ok = true) {
  const node = el('status-pill');
  node.textContent = text;
  node.className = ok ? 'pill pill-approved' : 'pill pill-rejected';
}

export function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
