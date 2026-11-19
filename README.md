# Ling Chan website

Static site (no build). Open `index.html`, or run `npx serve .`.

- `index.html` — public site + reservation flow (branch, date, party size, live availability, confirmation code, look up / cancel)
- `admin.html` — staff dashboard (per branch/day, seat/cancel, event requests); tables become stacked cards on phones
- `menu.js` — full Guerilla menu (EN + Chinese names, prices), transcribed from the menu photos on the Google listing; names marked as ours need checking by the restaurant
- `store.js` — availability engine + storage. **Demo storage is localStorage** (per browser) — replace `all/save/create/setStatus` with API calls to a real backend (or the POS vendor's booking API) before launch.

## Sourced from Facebook (Ling Chan page)
Name, tagline "Serving Authentic Happiness", category Chinese Restaurant, address (2 Guerilla St., Brgy. Sto. Niño, Marikina City 1800), phones (Guerilla 0927 012 4004, Panorama 0928 524 5346), email, services (reservations, in-store pickup, takeout, dine-in), Holiday Party Trays menu + prices, logo.

## To confirm with the restaurant
- Opening hours (11:00–21:00 is a placeholder in `store.js`)
- Table counts/capacities per branch (placeholder)
- Panorama branch full address
- Full à la carte menu (only the party-tray menu was public)
- Higher-resolution logo (current one is a screenshot crop of the FB profile photo)
- SMS/email confirmations (needs a provider)

## Demo data
`store.js` seeds sample bookings and events on first load and `app.js` pre-fills the forms while `CFG.demo = true`. Set it to `false` before going live.
