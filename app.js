const $ = id => document.getElementById(id);
const peso = n => '₱' + n.toLocaleString('en-PH');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

$('yr').textContent = new Date().getFullYear();

for (let i = 1; i <= CFG.maxPartyOnline; i++) {
  const t = i + (i === 1 ? ' guest' : ' guests');
  $('size').add(new Option(t, i, i === 2, i === 2)); $('qSize').add(new Option(t, i, i === 2, i === 2));
}
const today = new Date(); const iso = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
$('date').min = iso(today); $('date').value = iso(today);
$('date').max = iso(new Date(today.getTime() + 60 * 864e5));
$('qDate').min = $('date').min; $('qDate').max = $('date').max; $('qDate').value = $('date').value;

let chosen = '';
function renderSlots() {
  const b = $('branch').value, d = $('date').value, s = +$('size').value;
  const now = new Date(); const isToday = d === iso(now); const nowMin = now.getHours() * 60 + now.getMinutes();
  let any = false;
  $('slots').innerHTML = '';
  Store.slots().forEach(t => {
    const ok = !(isToday && Store.toMin(t) < nowMin + 30) && Store.isOpen(b, d, t, s);
    any = any || ok;
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'slot'; el.textContent = Store.label(t); el.disabled = !ok;
    el.setAttribute('role', 'radio'); el.setAttribute('aria-checked', String(t === chosen && ok));
    el.onclick = () => { chosen = t; renderSlots(); summary(); };
    $('slots').appendChild(el);
  });
  if (!Store.isOpen(b, d, chosen || '00:00', s) && chosen) chosen = '';
  $('slotMsg').textContent = any ? '' : 'No tables available for this date and party size. Try another date or call us.';
}
function summary() {
  const t = chosen ? Store.label(chosen) : '—';
  $('summary').innerHTML = `<h3>Your reservation</h3><div class="sum"><dl>
    <dt>Branch</dt><dd>${esc($('branch').value)}</dd><dt>Date</dt><dd>${esc($('date').value)}</dd>
    <dt>Time</dt><dd>${t}</dd><dt>Guests</dt><dd>${esc($('size').value)}</dd></dl></div>`;
}
['branch', 'date', 'size'].forEach(id => $(id).addEventListener('change', () => { renderSlots(); summary(); }));

$('resForm').addEventListener('submit', e => {
  e.preventDefault(); $('err').textContent = '';
  const name = $('name').value.trim(), phone = $('phone').value.replace(/[\s-]/g, '');
  if (!chosen) return $('err').textContent = 'Please choose a time.';
  if (name.length < 2) return $('err').textContent = 'Please enter your name.';
  if (!/^(\+?63|0)9\d{9}$/.test(phone)) return $('err').textContent = 'Enter a valid PH mobile number (09XX XXX XXXX).';
  const r = Store.create({ branch: $('branch').value, date: $('date').value, time: chosen, size: +$('size').value,
    name, phone, email: $('email').value.trim(), notes: $('notes').value.trim(), occasion: $('occasion').value });
  if (!r) { renderSlots(); return $('err').textContent = 'Sorry, that time was just taken. Please pick another.'; }
  $('mBody').innerHTML = `<p>Thanks, ${esc(r.name)}! Show this code at the door.</p><div class="code">${r.code}</div>
    <p class="center">${esc(r.branch)} · ${esc(r.date)} · ${Store.label(r.time)} · ${r.size} guests</p>`;
  $('modal').hidden = false; $('resForm').reset(); $('date').value = r.date; $('size').value = 2; chosen = ''; renderSlots(); summary();
});
$('mClose').onclick = () => $('modal').hidden = true;

$('lookup').addEventListener('submit', e => {
  e.preventDefault();
  const ev = Store.eventByCode($('code').value);
  if (ev) {
    $('found').innerHTML = `<p><b>${esc(ev.name)}</b> · ${esc(ev.type)} · ${esc(ev.branch)}<br>${esc(ev.date)} · ${esc(Store.sessionLabel(ev.session))} · ${ev.guests} guests<br>
      <span class="status ${ev.status}">${ev.status}</span></p>` +
      (ev.status === 'pending' || ev.status === 'confirmed' ? '<button class="btn small" id="cancelEv">Cancel event request</button>' : '');
    const ce = $('cancelEv'); if (ce) ce.onclick = () => { Store.setEventStatus(ev.id, 'cancelled'); $('lookup').requestSubmit(); renderEvSessions(); };
    return;
  }
  const r = Store.byCode($('code').value);
  if (!r) return $('found').innerHTML = '<p class="err">No booking found for that code.</p>';
  $('found').innerHTML = `<p><b>${esc(r.name)}</b> · ${esc(r.branch)}<br>${esc(r.date)} ${Store.label(r.time)} · ${r.size} guests<br>
    <span class="status ${r.status}">${r.status}</span></p>` +
    (r.status === 'confirmed' ? '<button class="btn small" id="cancelBtn">Cancel booking</button>' : '');
  const c = $('cancelBtn'); if (c) c.onclick = () => { Store.setStatus(r.id, 'cancelled'); $('lookup').requestSubmit(); renderSlots(); };
});

/* ---------- Event bookings ---------- */
const minEv = new Date(today.getTime() + CFG.eventMinDaysAhead * 864e5);
$('evDate').min = iso(minEv); $('evDate').value = iso(new Date(minEv.getTime() + 14 * 864e5));
$('evDate').max = iso(new Date(today.getTime() + 365 * 864e5));
let evSession = '';
function renderEvSessions() {
  const b = $('evBranch').value, d = $('evDate').value; let any = false;
  $('evSessions').innerHTML = '';
  CFG.eventSessions.forEach(s => {
    const ok = !Store.eventTaken(b, d, s.id); any = any || ok;
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'slot'; el.textContent = s.label; el.disabled = !ok;
    el.setAttribute('role', 'radio'); el.setAttribute('aria-checked', String(s.id === evSession && ok));
    el.onclick = () => { evSession = s.id; renderEvSessions(); };
    $('evSessions').appendChild(el);
  });
  if (evSession && Store.eventTaken(b, d, evSession)) evSession = '';
  $('evSlotMsg').textContent = any ? '' : 'This date is fully booked at this venue. Please pick another date.';
}
['evBranch', 'evDate'].forEach(id => $(id).addEventListener('change', renderEvSessions));
$('evForm').addEventListener('submit', e => {
  e.preventDefault(); $('evErr').textContent = '';
  const name = $('evName').value.trim(), phone = $('evPhone').value.replace(/[\s-]/g, ''), g = +$('evGuests').value;
  if (!$('evDate').value || $('evDate').value < $('evDate').min) return $('evErr').textContent = `Events need at least ${CFG.eventMinDaysAhead} days notice. Pick a later date.`;
  if (!(g >= 10 && g <= 150)) return $('evErr').textContent = 'We host events of 10 to 150 guests.';
  if (!evSession) return $('evErr').textContent = 'Please choose a session.';
  if (name.length < 2) return $('evErr').textContent = 'Please enter a contact name.';
  if (!/^(\+?63|0)9\d{9}$/.test(phone)) return $('evErr').textContent = 'Enter a valid PH mobile number (09XX XXX XXXX).';
  const r = Store.createEvent({ branch: $('evBranch').value, type: $('evType').value, date: $('evDate').value, session: evSession, guests: g,
    setup: $('evSetup').value, food: $('evFood').value, name, phone, email: $('evEmail').value.trim(), notes: $('evNotes').value.trim() });
  if (!r) { renderEvSessions(); return $('evErr').textContent = 'Sorry, that session was just taken. Please pick another.'; }
  $('mTitle').textContent = 'Event request received';
  $('mBody').innerHTML = `<p>Thanks, ${esc(r.name)}! We're holding your date. Our events team will contact you to confirm.</p><div class="code">${r.code}</div>
    <p class="center">${esc(r.type)} · ${esc(r.branch)}<br>${esc(r.date)} · ${esc(Store.sessionLabel(r.session))} · ${r.guests} guests</p>`;
  $('modal').hidden = false; $('evForm').reset(); $('evDate').value = r.date; $('evGuests').value = 30; evSession = ''; renderEvSessions();
});
$('mClose').onclick = () => { $('modal').hidden = true; $('mTitle').textContent = 'Reservation confirmed'; };

/* ---------- In-page navigation: every #anchor button scrolls ---------- */
function showTab(which) {
  const ev = which === 'event';
  $('resForm').hidden = ev; $('evForm').hidden = !ev;
  $('tabTable').setAttribute('aria-selected', String(!ev)); $('tabEvent').setAttribute('aria-selected', String(ev));
  $('summary').hidden = ev;
}
$('tabTable').onclick = () => showTab('table');
$('tabEvent').onclick = () => showTab('event');
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute('href');
  if (h === '#staff' || h === '#') return;
  if (a.dataset.tab) showTab(a.dataset.tab);
  const t = document.getElementById(h.slice(1)); if (!t) return;
  e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
/* Hero search bar: copy into the full form and jump to the times */
$('quick').addEventListener('submit', e => {
  e.preventDefault();
  $('branch').value = $('qBranch').value; $('size').value = $('qSize').value; $('date').value = $('qDate').value || $('date').value;
  showTab('table'); renderSlots(); summary();
  $('book').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
renderSlots(); summary(); renderEvSessions();
