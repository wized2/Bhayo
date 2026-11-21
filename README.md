# Bhayo

Team Bhayo: a small, fast profile site for the Bhayo Group. One `index.html`, no build step. Hosted on Cloudflare Pages.

## Features
- Member cards with search, light / dark / system theme
- Profile pages with Call, WhatsApp and Email buttons (deep-linkable: `/#umar`)
- Photo gallery per person: masonry layout that shows every photo whole, whatever its shape, with a full-screen viewer (swipe, arrow keys, dates, link to the original)
- Installable app (PWA) that works fully offline: pages, fonts, icons and photos are saved on the first visit, then only re-checked in the background (an unchanged file costs a tiny 304 reply, a changed one is refreshed for next time)
- Works on any screen; respects reduced motion and screen readers

## Editing
Everything lives in the `MEMBERS` array in `index.html`. To add photos, append to a member's `gallery`:

```js
{ src: 'https://i.ibb.co/…/photo.jpg', page: 'https://ibb.co/…', file: 'IMG_20260929_175235_361.jpg' }
```

The date shown on a photo is read from `file` (`IMG_YYYYMMDD_…`). Profile pictures are small copies in `img/`.

## Offline / PWA
`sw.js` handles caching. Fonts are self-hosted in `fonts/` (the icon font is trimmed to the icons used). If you add a new icon name to the page, regenerate `fonts/material-symbols.woff2`. Bump `VERSION` in `sw.js` only when you change its `PRECACHE` list. Cloudflare Pages reads `_headers` so `sw.js` is never cached.
