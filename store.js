// Reservation store + availability engine.
// Demo backend = localStorage. Swap the three functions marked API for fetch() calls
// to a real server (or the POS vendor's booking API) without touching the UI.
const CFG = {
  hours: { open: 11, close: 21 },        // TODO confirm real hours with the restaurant
  slotMinutes: 30,
  lastSeatingBeforeClose: 1,             // hours
  diningMinutes: 90,
  maxPartyOnline: 12,
  // Tables per branch: capacity -> how many. TODO confirm real floor plan.
  tables: {
    Guerilla: [{ seats: 2, n: 6 }, { seats: 4, n: 10 }, { seats: 6, n: 6 }, { seats: 10, n: 3 }, { seats: 12, n: 1 }],
    Panorama: [{ seats: 2, n: 6 }, { seats: 4, n: 10 }, { seats: 6, n: 6 }, { seats: 10, n: 3 }]
  }
};
CFG.eventSessions = [   // TODO confirm with the restaurant
  { id: 'lunch', label: 'Lunch · 11:00 AM – 3:00 PM' },
  { id: 'dinner', label: 'Dinner · 5:00 PM – 10:00 PM' }
];
CFG.eventMinDaysAhead = 3;
const KEY = 'lingchan.reservations.v1';
const EKEY = 'lingchan.events.v1';
const Store = {
  all() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } },   // API: GET /reservations
  save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} },
  hhmm(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); },
  toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; },
  slots() {
    const out = [];
    for (let m = CFG.hours.open * 60; m <= (CFG.hours.close - CFG.lastSeatingBeforeClose) * 60; m += CFG.slotMinutes) out.push(this.hhmm(m));
    return out;
  },
  label(t) { const [h, m] = t.split(':').map(Number); return ((h + 11) % 12 + 1) + ':' + String(m).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); },
  // Smallest-fit table assignment; returns tables still free at this slot for a party.
  freeTables(branch, date, time, size, ignoreId) {
    const start = this.toMin(time), end = start + CFG.diningMinutes;
    const busy = this.all().filter(r => r.branch === branch && r.date === date && r.status !== 'cancelled' && r.id !== ignoreId &&
      this.toMin(r.time) < end && this.toMin(r.time) + CFG.diningMinutes > start);
    const pool = [];
    CFG.tables[branch].forEach(t => { for (let i = 1; i <= t.n; i++) pool.push({ id: t.seats + '-' + i, seats: t.seats }); });
    busy.forEach(r => { const i = pool.findIndex(p => p.id === r.table); if (i > -1) pool.splice(i, 1); });
    return pool.filter(p => p.seats >= size).sort((a, b) => a.seats - b.seats);
  },
  isOpen(branch, date, time, size) { return this.freeTables(branch, date, time, size).length > 0; },
  create(r) {                                                                                  // API: POST /reservations
    const free = this.freeTables(r.branch, r.date, r.time, r.size);
    if (!free.length) return null;                                                             // re-check at write time
    const list = this.all();
    const rec = { ...r, id: crypto.randomUUID(), code: this.code(list), table: free[0].id, status: 'confirmed', createdAt: Date.now() };
    list.push(rec); this.save(list); return rec;
  },
  code(list) { let c; do { c = 'LC-' + Math.random().toString(36).slice(2, 7).toUpperCase(); } while (list.some(r => r.code === c)); return c; },
  byCode(code) { return this.all().find(r => r.code === code.trim().toUpperCase()); },
  setStatus(id, status) { const l = this.all(); const r = l.find(x => x.id === id); if (r) { r.status = status; this.save(l); } }   // API: PATCH
};
// Event bookings: one event per venue + date + session. Starts as 'pending' until staff confirm.
Object.assign(Store, {
  events() { try { return JSON.parse(localStorage.getItem(EKEY)) || []; } catch { return []; } },
  saveEvents(l) { try { localStorage.setItem(EKEY, JSON.stringify(l)); } catch {} },
  eventTaken(branch, date, session) {
    return this.events().some(e => e.branch === branch && e.date === date && e.session === session && e.status !== 'cancelled' && e.status !== 'declined');
  },
  createEvent(r) {
    if (this.eventTaken(r.branch, r.date, r.session)) return null;
    const l = this.events(); let code;
    do { code = 'EV-' + Math.random().toString(36).slice(2, 7).toUpperCase(); } while (l.some(e => e.code === code));
    const rec = { ...r, id: crypto.randomUUID(), code, status: 'pending', createdAt: Date.now() };
    l.push(rec); this.saveEvents(l); return rec;
  },
  eventByCode(code) { return this.events().find(e => e.code === code.trim().toUpperCase()); },
  setEventStatus(id, status) { const l = this.events(); const e = l.find(x => x.id === id); if (e) { e.status = status; this.saveEvents(l); } },
  sessionLabel(id) { return (CFG.eventSessions.find(s => s.id === id) || {}).label || id; }
});

// ---------- Demo data (prototype only) ----------
// Turn off with CFG.demo = false once a real backend exists. Seeds once per browser.
CFG.demo = true;
Store.seedDemo = function () {
  try { if (localStorage.getItem(KEY) !== null || localStorage.getItem(EKEY) !== null) return; } catch { return; }
  const iso = n => { const d = new Date(Date.now() + n * 864e5); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  const list = [];
  const add = (branch, date, time, size, name, phone, occasion, notes, status = 'confirmed') => {
    const keep = this.all; this.all = () => list;                       // let freeTables see the list being built
    const free = this.freeTables(branch, date, time, size); this.all = keep;
    if (!free.length) return;
    list.push({ id: 'demo' + list.length, code: 'LC-DEMO' + list.length, branch, date, time, size, name, phone, email: '', occasion, notes, table: free[0].id, status, createdAt: Date.now() });
  };
  // Today and tomorrow, Guerilla
  add('Guerilla', iso(0), '12:00', 6, 'Dela Cruz family', '0917 555 0101', 'Birthday', 'Birthday noodles please');
  add('Guerilla', iso(0), '12:30', 2, 'Maria Santos', '0918 555 0102', '', '');
  add('Guerilla', iso(0), '18:00', 4, 'J. Tan', '0920 555 0104', 'Anniversary', 'Quiet table');
  add('Guerilla', iso(0), '18:30', 10, 'Reyes Holiday Party', '0927 555 0103', 'Holiday party', 'Need 2 high chairs', 'seated');
  add('Panorama', iso(0), '18:30', 4, 'Lim', '0915 555 0105', '', '');
  add('Guerilla', iso(1), '11:30', 3, 'Garcia', '0916 555 0106', '', '');
  add('Guerilla', iso(1), '12:00', 8, 'Bautista & friends', '0919 555 0107', 'Business', 'Invoice needed');
  // Tomorrow 7 PM: every table that seats 6 or more is taken, so larger parties see it greyed out
  [['Cruz', 6], ['Ocampo', 6], ['Mendoza', 6], ['Villanueva', 6], ['Pascual', 6], ['Aquino', 6], ['Tolentino', 10], ['Salazar', 10], ['Navarro', 10], ['Domingo', 12]]
    .forEach(([n, s], i) => add('Guerilla', iso(1), '19:00', s, n + ' family', '0917 555 02' + String(10 + i), '', ''));
  add('Guerilla', iso(2), '18:00', 5, 'Ramos', '0921 555 0108', 'Birthday', 'Cake arrives at 6');
  add('Panorama', iso(2), '12:00', 12, 'Uy', '0922 555 0109', 'Family gathering', '');
  this.save(list);
  this.saveEvents([
    { id: 'evdemo0', code: 'EV-DEMO0', branch: 'Guerilla', type: 'Birthday', date: iso(10), session: 'dinner', guests: 45, setup: 'Function area (private)', food: 'Set menu per head', name: 'Aileen Cruz', phone: '0917 555 0199', email: 'aileen@example.com', notes: '60th birthday, needs karaoke', status: 'pending', createdAt: Date.now() },
    { id: 'evdemo1', code: 'EV-DEMO1', branch: 'Guerilla', type: 'Company event', date: iso(21), session: 'lunch', guests: 80, setup: 'Whole restaurant buy-out', food: 'Party trays', name: 'R. Mendoza', phone: '0928 555 0188', email: '', notes: 'Year-end lunch', status: 'confirmed', createdAt: Date.now() },
    { id: 'evdemo2', code: 'EV-DEMO2', branch: 'Panorama', type: 'Wedding / Reception', date: iso(35), session: 'dinner', guests: 120, setup: 'Whole restaurant buy-out', food: 'Set menu per head', name: 'Santos-Lee', phone: '0917 555 0177', email: '', notes: 'Reception for 120, stage and sound system', status: 'pending', createdAt: Date.now() }
  ]);
};
if (CFG.demo) Store.seedDemo();
