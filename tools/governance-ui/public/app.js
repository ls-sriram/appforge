import { setStatus } from './js/utils.js';
import { hookEvents, loadQueue } from './js/actions.js';
import { setMode, applyCodeWrapState } from './js/render.js';

(async function init() {
  try {
    hookEvents();
    setMode('summary');
    applyCodeWrapState();
    await loadQueue();
    setStatus('Connected');
  } catch (err) {
    console.error(err);
    setStatus('Error', false);
  }
})();
