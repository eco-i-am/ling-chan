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
