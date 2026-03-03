/* ============================================================
   ZOU – APP.JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Router.go('accueil');
  renderEventList(EVENTS);
  initFilterChips();
});

/* ══ NOTIFICATION iOS — TOMBE DU HAUT ════════════════════════ */
let _notifTimer  = null;
let _notifHideT  = null;

function showIosNotif() {
  const el = document.getElementById('ios-notif');
  if (!el) return;
  el.classList.remove('hide');
  void el.offsetWidth;           // force reflow
  el.classList.add('show');
  clearTimeout(_notifHideT);
  _notifHideT = setTimeout(() => hideIosNotif(), 3000);
}

function hideIosNotif() {
  clearTimeout(_notifHideT);
  const el = document.getElementById('ios-notif');
  if (!el) return;
  el.classList.remove('show');
  el.classList.add('hide');
}

function iosNotifReserve() {
  hideIosNotif();
  openEvent(1);
}

/* ══ EVENTS LIST ══════════════════════════════════════════════ */
function renderEventList(events) {
  const list = document.getElementById('events-list');
  list.innerHTML = events.map(ev => `
    <div class="ev-card" onclick="openEvent(${ev.id})">
      <div class="ev-card-thumb">
        <img src="${ev.img}" alt="${ev.title}" loading="lazy">
        <span class="ev-card-tag">${ev.tag}</span>
        ${ev.badge ? `<span class="ev-card-partner">${ev.badge}</span>` : ''}
        <span class="ev-card-price ${ev.price===0?'free':'paid'}">${ev.priceLabel}</span>
      </div>
      <div class="ev-card-body">
        <p class="ev-card-name">${ev.title}</p>
        <p class="ev-card-loc">📍 ${ev.location} &bull; ${ev.places} places</p>
        <p class="ev-card-sub">${ev.subtitle}</p>
        <span class="xp-badge">⚡ +${ev.xp} XP</span>
      </div>
    </div>
  `).join('');
}

function initFilterChips() {
  document.querySelectorAll('.filter-row .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-row .chip').forEach(c => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');
    });
  });
}

/* ══ CONNEXION ════════════════════════════════════════════════ */
let _pwdVisible = false;
function togglePwd() {
  _pwdVisible = !_pwdVisible;
  document.getElementById('inp-pwd').type = _pwdVisible ? 'text' : 'password';
  document.getElementById('eye-btn').textContent = _pwdVisible ? '🙈' : '👁';
}
function handleLogin() {
  const email = document.getElementById('inp-email').value.trim();
  if (!email) {
    document.getElementById('inp-email').style.borderColor = 'var(--pink)';
    document.getElementById('inp-email').focus();
    return;
  }
  Router.go('opener');
}

/* ══ QUIZ ═════════════════════════════════════════════════════ */
function selectChoice(btn, quizId) {
  document.querySelectorAll(`#${quizId} .choice-btn`).forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById(`${quizId}-next`).disabled = false;
}

/* ══ EVENT PAGE ═══════════════════════════════════════════════ */
function fillEventScreen(ev) {
  document.getElementById('evp-hero-img').src = ev.img;
  document.getElementById('evp-hero-img').alt = ev.title;
  document.getElementById('evp-title').textContent = ev.title;
  document.getElementById('evp-desc').textContent  = ev.description;
  const chips = [
    { label: `📅 Aujourd'hui • ${ev.hours}`, cls: 'chip-today' },
    { label: `📍 Paris – 11ème`,             cls: 'chip-loc'   },
    { label: ev.type,                         cls: ''           },
    { label: `🎟 ${ev.places} Places | ${ev.remaining} Restantes`, cls: '' },
    { label: `💳 ${ev.priceLabel}`,           cls: 'chip-price' },
  ];
  document.getElementById('evp-chips').innerHTML = chips
    .map(c => `<span class="chip ${c.cls}">${c.label}</span>`).join('');
  document.getElementById('evp-warn-txt').textContent = ev.warnMsg;
  document.getElementById('evp-xp-top').textContent   = `🏆 Plus qu'1 soirée pour ta pinte 🍺`;
  document.getElementById('evp-xp-pct').textContent   = ev.progVal + ' %';
  document.getElementById('evp-prog-txt').textContent = `⚡ ${ev.progMsg}`;
  document.getElementById('evp-reserve-btn').textContent = `Réserver ma place – ${ev.priceLabel}`;
  document.getElementById('evp-prog-fill').style.width = '0%';
  setTimeout(() => { document.getElementById('evp-prog-fill').style.width = ev.progVal + '%'; }, 350);
}

function openEvent(id) {
  const ev = EVENTS.find(e => e.id === id);
  if (!ev) return;
  STATE.currentEvent = ev;
  STATE.qty = 1;
  fillEventScreen(ev);
  Router.go('event');
}

/* ══ RESERVATION ══════════════════════════════════════════════ */
function openConfirm() {
  const ev = STATE.currentEvent;
  if (!ev) return;
  STATE.qty = 1;
  document.getElementById('cfm-sub').textContent       = `${ev.title} • ${ev.date}`;
  document.getElementById('cfm-event').textContent     = ev.title;
  document.getElementById('cfm-venue').textContent     = ev.venue;
  document.getElementById('cfm-price-per').textContent = ev.price === 0 ? 'Gratuit' : ev.price + ' Euros';
  document.getElementById('cfm-date').textContent      = ev.date;
  document.getElementById('cfm-qty-display').textContent = 1;
  updateCfmBtn();
  Router.go('confirm');
}

function changeQty(delta) {
  STATE.qty = Math.max(1, Math.min(10, STATE.qty + delta));
  document.getElementById('cfm-qty-display').textContent = STATE.qty;
  updateCfmBtn();
}

function updateCfmBtn() {
  const ev    = STATE.currentEvent;
  const total = ev.price === 0 ? 'Gratuit' : (ev.price * STATE.qty) + ' €';
  document.getElementById('cfm-btn').textContent = `Réserver ma place – ${total}`;
}

function confirmReservation() {
  const ev    = STATE.currentEvent;
  const qty   = STATE.qty;
  const total = ev.price === 0 ? 'Gratuit' : (ev.price * qty) + ' €';
  STATE.billet = { ev, qty, total };
  document.getElementById('val-event').textContent  = ev.title;
  document.getElementById('val-venue').textContent  = ev.venue;
  document.getElementById('val-date').textContent   = ev.date;
  document.getElementById('val-places').textContent = qty + ' Place' + (qty > 1 ? 's' : '');
  document.getElementById('val-total').textContent  = total;
  document.getElementById('val-email').textContent  = 'Confirmation envoyée à ' + USER.email;
  updateBillets(ev, qty, total);
  Router.go('validation');
}

/* ══ BILLETS ══════════════════════════════════════════════════ */
function updateBillets(ev, qty, total) {
  document.getElementById('billet-empty').style.display = 'none';
  const card = document.getElementById('billet-card');
  card.style.display = 'block';
  document.getElementById('billet-name').textContent  = ev.title;
  document.getElementById('billet-info').textContent  = `${ev.date} • ${ev.venue}`;
  document.getElementById('billet-total').textContent = total;
}

/* ══ HOOKS ════════════════════════════════════════════════════ */
Hooks.activites = function() {
  clearTimeout(_notifTimer);
  const el = document.getElementById('ios-notif');
  if (el) { el.classList.remove('show', 'hide'); }
  _notifTimer = setTimeout(() => showIosNotif(), 1000);
};

Hooks.profil = function() {
  setTimeout(() => {
    const fill = document.getElementById('xp-fill');
    if (fill) fill.style.width = '82%';
  }, 300);
};

Hooks.validation = function() {
  const t = document.getElementById('val-thumb');
  if (t) {
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = 'bounceIn .7s cubic-bezier(0.34,1.56,0.64,1) forwards';
  }
};

/* ══ SCANNER ══════════════════════════════════════════════════ */
let _scanTimer = null;

function openScanner() {
  const overlay = document.getElementById('scanner-overlay');
  // Reset state
  document.getElementById('scan-success').classList.remove('show');
  document.getElementById('scanner-billet-info').style.display = 'block';
  document.getElementById('scanner-done').style.display = 'none';
  document.getElementById('scan-laser').style.display = 'block';
  overlay.classList.add('open');

  // Simulate scan after 2.5s
  clearTimeout(_scanTimer);
  _scanTimer = setTimeout(() => triggerScanSuccess(), 2500);
}

function closeScanner() {
  clearTimeout(_scanTimer);
  document.getElementById('scanner-overlay').classList.remove('open');
  // Reset laser animation
  setTimeout(() => {
    document.getElementById('scan-success').classList.remove('show');
    document.getElementById('scanner-billet-info').style.display = 'block';
    document.getElementById('scanner-done').style.display = 'none';
    document.getElementById('scan-laser').style.display = 'block';
  }, 400);
}

function triggerScanSuccess() {
  // Stop laser
  document.getElementById('scan-laser').style.display = 'none';
  // Show green success overlay
  document.getElementById('scan-success').classList.add('show');
  // After 1.2s swap info → done message
  setTimeout(() => {
    document.getElementById('scanner-billet-info').style.display = 'none';
    document.getElementById('scanner-done').style.display = 'block';
  }, 1200);
}

/* ══ NOTIFICATION BOTTOM ══════════════════════════════════════════════ */
function hideNotif() {
  const notif = document.getElementById('bottom-notif');
  if (notif) {
    notif.classList.remove('show');
    setTimeout(() => notif.style.display = 'none', 300);
  }
}

function notifGoReserve() {
  hideNotif();
  openEvent(1);
}
