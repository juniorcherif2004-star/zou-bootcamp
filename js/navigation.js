/* ============================================================
   ZOU – NAVIGATION
   ============================================================ */

const TAB_SCREENS = ['activites','event','profil','billets'];

const Router = {
  history: [],
  current: null,

  go(id) {
    const prev = document.querySelector('.screen.active');
    const next = document.getElementById(id);
    if (!next || (prev && prev.id === id)) return;

    if (prev) prev.classList.remove('active');
    next.classList.add('active');
    this.history.push(this.current);
    this.current = id;

    // Tab bar
    const tabBar = document.getElementById('tab-bar');
    if (TAB_SCREENS.includes(id)) {
      tabBar.classList.add('visible');
    } else {
      tabBar.classList.remove('visible');
    }
    // Active tab item
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.remove('active');
      if (t.dataset.screen === id || (t.dataset.screen === 'activites' && id === 'event')) {
        t.classList.add('active');
      }
    });

    // Lifecycle
    if (typeof Hooks[id] === 'function') Hooks[id]();

    next.scrollTop = 0;
    window.scrollTo(0,0);
  },

  back() {
    if (!this.history.length) return;
    const prev = this.history.pop();
    this.go(prev);
    // Remove duplicate history entry added by go()
    this.history.pop();
  }
};

const Hooks = {};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') Router.back();
});
