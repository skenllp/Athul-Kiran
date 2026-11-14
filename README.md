# Athul Raj & Kiran Santhosh — Wedding Invitation Website

Static, single-page, mobile-first invitation. No build step.

## File structure

```
Athul-Kiran/
├── index.html                 ← the whole site (HTML + CSS + JS)
├── config.js                  ← ★ paste your Google Apps Script URL here
├── hero-bg.jpg                ← couple photo for the opening screen + hero (desktop)
├── carnival.mp4               ← Carnival Night video   (9:16, 720×1280)
├── cocktail.mp4               ← Cocktail Night video
├── reception.mp4              ← Reception video
├── wedding-art.webp           ← Wedding image (transparent background, shown full)
├── background-music.mp3       ← background music (plays after "Open Invitation")
├── og-chase-full.jpg               ← WhatsApp / social link preview (1024×1280, the full photo, uncropped)
├── couple-bg.jpg, footer-bg.jpg
├── covers/
│   ├── carnival-poster.jpg    ← still shown while each video loads
│   ├── cocktail-poster.jpg
│   └── reception-poster.jpg
├── gallery/                   ← 8 photos for the Photo Gallery
├── venues/                    ← 4 venue photos (<event>-photo.jpg)
├── google-apps-script/
│   └── Code.gs                ← ★ paste into Google Apps Script (RSVP → Sheet)
└── README.md
```

## Where to place / replace assets

| To change… | Replace this file (keep the same name) |
|---|---|
| Opening screen + hero couple photo | `hero-bg.jpg` (desktop, landscape ~1600×1000) and `gallery/forest-portrait.jpg` (phones, portrait) |
| Carnival / Cocktail / Reception video | `carnival.mp4` / `cocktail.mp4` / `reception.mp4` |
| Wedding image | `wedding-art.webp` |
| Still image shown before a video plays | `covers/<event>-poster.jpg` |
| Link-preview image | `og-chase-full.jpg` (1200×630) |
| Gallery photos (swipe left/right carousel) | files in `gallery/` |
| Venue photos (Venues section) | `venues/carnival-photo.jpg`, `cocktail-photo.jpg`, `wedding-photo.jpg`, `reception-photo.jpg` (16:10, ~1000 px wide) |

**Videos:** the supplied originals were 14–18 MB each (1080×1920) — too heavy for guests on mobile data — so the site uses web-optimised 720×1280 versions (0.7–2 MB each, same 9:16 shape, silent). If you replace a video, export it as H.264 MP4, 9:16, ideally under ~3 MB, with "fast start"/"web optimised" enabled. The site shows videos at their exact ratio, so nothing is cropped.


## Connect RSVP to Google Sheets (≈5 minutes)

1. Go to <https://sheets.google.com> → create a **blank spreadsheet** (name it e.g. *Wedding RSVPs*).
2. In that sheet: **Extensions ▸ Apps Script**.
3. Delete the sample code, then paste the entire contents of `google-apps-script/Code.gs`. Click **Save**.
   * Created the script **from inside the sheet** (step 2)? Leave `const SHEET_ID = '';` empty — it uses that sheet automatically.
   * Using a standalone script instead? Paste the Sheet ID into `SHEET_ID` at the top of `Code.gs` (the long text in the sheet URL between `/d/` and `/edit`).
4. Choose the function **`setup`** in the toolbar and click **Run**. Approve the permissions (Advanced ▸ Go to project ▸ Allow). This creates the *RSVPs* tab with headers and a *Summary* tab (parties and total guests per event).
5. **Deploy ▸ New deployment ▸** gear icon ▸ **Web app**:
   * Execute as: **Me**
   * Who has access: **Anyone**
   * Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Open **`config.js`** and paste that URL (already done in this version):
   ```js
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
7. Test: open the URL from step 5 in a browser — you should see `{"ok":true,"message":"RSVP endpoint is live…"}`. Then submit the RSVP form on your site and check a new row appears.

**Columns saved:** Timestamp (IST) · Guest Name · Mobile Number · Number of Guests · Carnival Night · Cocktail Night · Wedding · Reception (each "Yes" or blank) · Message · Submission ID.

**If you edit `Code.gs` later** you must publish the change: *Deploy ▸ Manage deployments ▸ ✏️ ▸ Version: New version ▸ Deploy*. The URL stays the same.

Built-in protections: server-side validation, duplicate-submit guard, spam honeypot, and sheet-formula injection guard. If a guest's submission fails (e.g. no internet) the form shows an error and offers to send the RSVP on WhatsApp instead (number set in `config.js`; set it to `""` to remove).

Until `APPS_SCRIPT_URL` is set, the form shows "RSVP is not connected yet" so you can't miss it while testing.

## Deploy the website

The site is plain static files — upload the **whole folder** (all files and sub-folders) and make sure `index.html` is served at the root.

**Netlify (easiest, free):** <https://app.netlify.com/drop> → drag the `Athul-Kiran` folder onto the page. You get a link instantly; rename it under *Site settings ▸ Change site name*, or attach your own domain.

**GitHub Pages:** push the folder to a GitHub repo → *Settings ▸ Pages ▸ Deploy from branch ▸ `main` / root*. (This folder already contains your `.git` history.)

**Hostinger / cPanel:** upload everything into `public_html/` with File Manager or FTP.

### Link preview (already set)
`og:url` is `https://athul-kiran.vercel.app/` and the preview image is `https://athul-kiran.vercel.app/og-chase-full.jpg`. If you change the domain, update those two (plus `twitter:image`) near the top of `index.html`. WhatsApp caches previews, so a changed image can take a while to appear.

**Vercel:** import the folder/GitHub repo as a *Static / Other* project (no build command, output directory `.`).

## Local preview
```
cd Athul-Kiran
python3 -m http.server 8000      # then open http://localhost:8000
```
Opening `index.html` directly also works, but the RSVP and videos behave best from a server. Internet is needed for Google Fonts.

## Event details (as published on the site)

| Event | Date | Time | Venue | Dress code / theme |
|---|---|---|---|---|
| Carnival Night | Wed, 6 Jan 2027 | 4:00 PM – 8:00 PM | Tarang Resort, Kadalundi | Pop Up Colours |
| Cocktail Night | Thu, 7 Jan 2027 | 5:00 PM – 10:00 PM | Thrithi by the River, Kadalundi | Theme: Glitz in Dark Shades |
| The Wedding | Sat, 9 Jan 2027 | 11:00 – 11:45 AM | K-Hills Convention Centre, Farook College, Kozhikode | Traditional |
| The Reception | Sun, 10 Jan 2027 | 5:00 PM – 9:00 PM | Malabar Marina Convention Centre, Kozhikode | Party Wear |

The **Get Directions** buttons open **Google Maps** for these names — please tap each once and confirm it lands on the right place; if not, replace the link with the venue's exact Google Maps share link.

## Notes
* **"10 Years of Love"** appears only once — on the opening screen. It is removed from the page title, hero, story, event sections and link preview.
* **Wedding and Reception use full images** (no video): they rise in as you scroll to them, then float gently with a soft glow and sparkles. The images are never cropped. Event details are shown below each image.
* **Carnival and Cocktail videos already contain the invitation text** (names, title, date, venue), so no extra text is laid over them. Event details sit in the card beside each video, and the videos are never zoomed, dimmed or cropped. Each video sits in a framed card beside the event details (above the details on phones). Videos play silently on screen, and each has a **Full screen** button.
* The **Cocktail video** says "Trithi by River" and "Glits in Dark Shades"; the website says "Thrithi by the River" and "Glitz in Dark Shades". Re-export the video if you want them to match.
* Background music is the file already in the project — make sure you have the right to publish it.

* **Our Story section is hidden** (commented out in `index.html`, search for `OUR STORY SECTION IS HIDDEN`). To bring it back, delete that comment line and the `-->` after the section, and add `<a href="#story">Our Story</a>` back to the nav.
