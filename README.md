# Bhayo

Team Bhayo: a small, fast profile site for the Bhayo Group. One `index.html`, no build step. Hosted on Cloudflare Pages.

## Features
- Member cards with search, light / dark / system theme
- Profile pages with Call, WhatsApp and Email buttons (deep-linkable: `/#umar`)
- Photo gallery per person: masonry layout that shows every photo whole, whatever its shape, with a full-screen viewer (swipe, arrow keys, dates, link to the original)
- Works on any screen; respects reduced motion and screen readers

## Editing
Everything lives in the `MEMBERS` array in `index.html`. To add photos, append to a member's `gallery`:

```js
{ src: 'https://i.ibb.co/…/photo.jpg', page: 'https://ibb.co/…', file: 'IMG_20260929_175235_361.jpg' }
```

The date shown on a photo is read from `file` (`IMG_YYYYMMDD_…`). Profile pictures are small copies in `img/`.
