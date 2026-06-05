# Found in Japan — Website
Last updated: June 2026

## Files
- index.html      — Home page
- about.html      — About William
- videos.html     — Videos page
- found.html      — What We Found (places, food, events)
- featured.html   — Featured Items (Amazon affiliate)
- shop.html       — Shop (under construction)
- kanji.html      — 漢字 Stroke Order viewer
- contact.html    — Contact page
- style.css       — All shared styles
- main.js         — Nav toggle + scroll animations
- found.js        — Filter logic for What We Found page
- fij-logo.png    — Found in Japan logo
- sample-karaage.jpg — Sample photo for What We Found

---

## Uploading to Cloudflare Pages (updates)
1. Make changes to HTML/CSS files
2. Go to dash.cloudflare.com
3. Workers & Pages → green-bread-9c1b → New deployment
4. Upload assets → drag the folder in
5. Deploy

---

## Setting up the Kanji Stroke Order tool (REQUIRED)

The kanji.html page needs KanjiVG SVG data files to work.
These are NOT included in this zip due to their size (~6,500 files).

### Download steps:
1. Go to: https://github.com/KanjiVG/kanjivg/releases
2. Download the latest release zip (e.g. kanjivg-20220627.zip)
3. Unzip it — you will find a folder called "kanji" containing .svg files
4. Place that entire "kanji" folder inside the foundinjapan-site folder
   (same level as index.html)
5. Re-upload everything to Cloudflare Pages

### After upload the tool will work in all browsers (Chrome, Safari, Firefox, Edge)
because the files are served from your own domain — no CORS issues.

### Attribution (already in kanji.html)
KanjiVG by Ulrich Apel — https://kanjivg.tagaini.net
Licensed under Creative Commons Attribution-Share Alike 3.0
Source: https://github.com/KanjiVG/kanjivg

---

## Adding entries to What We Found (found.html)
1. Open found.html in a text editor
2. Find the comment "CARD START"
3. Copy the block from CARD START to CARD END
4. Paste it above the closing </div> of found-grid
5. Update photo, category, name, location, date, note, maps link
6. Save and re-upload found.html + the new photo to Cloudflare

## Adding items to Featured Items (featured.html)
Same process — find ITEM START / ITEM END, copy, paste, fill in details.
Replace the # in amazon-link href with your actual affiliate URL.

---

## Contact email
contact@foundinjapan.co routes to foundinjapanmail@gmail.com via Cloudflare Email Routing.
