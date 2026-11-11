# Athul Raj & Kiran Santhosh — Wedding Invitation Website

## Included
- `index.html`: customized, responsive, single-page invitation derived from the provided Jishnu–Vibha reference layout.
- Opening screen, 10 Years of Love story, four celebration chapters, photo gallery, ceremony countdown, maps, calendar downloads and RSVP.
- The supplied client photographs and carnival/cocktail poster artwork are included in `gallery/` and `covers/`.
- QR codes in `venues/` for all four location searches.
- `og-image.jpg` is a 1200 × 630 image for WhatsApp/social previews.

## Preview
Serve the folder as a static site (recommended: `python -m http.server 8000`), then open `http://localhost:8000`.
You can also open `index.html` directly. Internet is needed for Google Fonts, venue maps and WhatsApp.

## Publish
Upload **all** files in this folder to a static host such as GitHub Pages, Netlify or Hostinger. Set the deployment to serve `index.html` at the site root.

**Important before publishing:**
1. Update `https://YOUR-DOMAIN.example/` and `https://YOUR-DOMAIN.example/og-image.jpg` in the Open Graph tags near the start of `index.html` to the **actual https website URL**. Social link thumbnails need absolute HTTPS URLs.
2. The RSVP form opens WhatsApp with a prefilled message to `+91 9847509050`, the telephone number printed on the provided family invitation. This does **not** transmit/record a response automatically: the guest must press **Send** in WhatsApp. If the couple prefers a different RSVP number, edit the `RSVP_WHATSAPP_NUMBER` constant in `index.html` (use country code, digits only).
3. Confirm the exact public names of `Tarang Resort / Tarang Farm House` and `Thrithi / Thrithi by the River`, along with the contact number. The venue links are **Google Maps search links**, not verified exact place IDs.
4. No original music from the sample wedding is included. Add a licensed or client-approved soundtrack only if requested.

## Event details
- Carnival Night — 6 Jan 2027, 4 PM–8 PM; Tarang Farm House (Tarang Resort), Kadalundi; **Pop-Up Colours**
- Cocktail Night — 7 Jan 2027, 5 PM–10 PM; Thrithi, By The River, Kadalundi; **Glitz in Dark Shades**
- Wedding — 9 Jan 2027, 11 AM–11:45 AM; K-Hills Convention Centre, Kozhikode; **Traditional Attire**
- Reception — 10 Jan 2027, 5 PM–9 PM; Malabar Marina Convention Centre, Kozhikode; **Party Wear**

## Later improvement (optional)
If the client wants RSVP submissions recorded in Google Sheets rather than WhatsApp, add a *new dedicated* Google Apps Script integration and update the submit handler. The original sample's endpoint and guest data are not included or used.


## Background music
The file `background-music.mp3` has been converted from `music.webm` bundled with the user-supplied `jishnu-vibha-main.zip` reference website. It begins after the user clicks **Open Invitation** and loops continuously; the floating **Music on/off** control can pause/resume it. Browsers intentionally block unprompted audio autoplay. Verify that you have the necessary rights to publish the audio on your website.
