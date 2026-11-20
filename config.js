/* ==========================================================================
   WEDDING SITE SETTINGS  —  the only file you need to edit to go live
   ========================================================================== */
window.WEDDING_CONFIG = {

  /* ▼▼▼  PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BETWEEN THE QUOTES  ▼▼▼
     It looks like:  https://script.google.com/macros/s/AKfycb.../exec
     How to get it: see README.md  →  "Connect RSVP to Google Sheets"            */
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbw9695YJpF1_JqCDoQp5d-YkX7-VYjjbhSrCLY6sEO5UiQfzq1gwSJw_sk2CjArWaJvsQ/exec",
  /* ▲▲▲  (the Google Sheet ID is NOT needed here — it goes in
          google-apps-script/Code.gs, only if you don't create the script
          from inside the Sheet itself)                                          */

  /* Optional: if a guest's RSVP fails (e.g. no internet), the form offers a
     "Send on WhatsApp instead" button to this number (country code + digits,
     no "+"). Set to "" to hide the button. */
  WHATSAPP_FALLBACK_NUMBER: "919847509050"
};
