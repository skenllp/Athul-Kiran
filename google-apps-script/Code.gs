/**
 * Athul Raj & Kiran Santhosh — RSVP collector (Google Apps Script)
 * ---------------------------------------------------------------------------
 * Receives the website's RSVP form and appends one row per response to a
 * Google Sheet.  Setup steps are in README.md ("Connect RSVP to Google Sheets").
 *
 * QUICK VERSION
 *  1. Create a new Google Sheet  →  Extensions ▸ Apps Script  →  paste this file.
 *  2. Run  setup()  once (authorise when asked).
 *  3. Deploy ▸ New deployment ▸ Web app ▸ Execute as: Me ▸ Who has access: Anyone.
 *  4. Copy the Web App URL into  config.js  (APPS_SCRIPT_URL).
 */

/* ▼▼▼ OPTIONAL: PASTE YOUR GOOGLE SHEET ID HERE ▼▼▼
   • Created the script from inside the Sheet (Extensions ▸ Apps Script)?
     Leave this as '' — the script automatically uses that Sheet.
   • Script is standalone (script.google.com)?  Paste the Sheet ID here.
     The ID is the long text in the Sheet's URL:
     https://docs.google.com/spreadsheets/d/  <THIS-PART>  /edit
*/
const SHEET_ID = '';

const SHEET_NAME = 'RSVPs';          // tab that stores responses
const TIME_ZONE  = 'Asia/Kolkata';   // timestamps are written in IST
const MAX_GUESTS = 20;

// Event names must match the checkbox values in index.html
const EVENTS = ['Carnival Night', 'Cocktail Night', 'Wedding', 'Reception'];

const HEADERS = [
  'Timestamp (IST)', 'Guest Name', 'Mobile Number', 'Number of Guests',
  'Carnival Night', 'Cocktail Night', 'Wedding', 'Reception',
  'Message', 'Submission ID'
];
const COL_PHONE = 3, COL_ID = 10;


/** Receives the form (POST). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);                       // avoid two guests writing to the same row
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // ----- validate (server-side, never trust the browser) -----
    const name   = clean_(data.name, 80);
    const phone  = clean_(data.phone, 20);
    const guests = parseInt(data.guests, 10);
    const msg    = clean_(data.message, 500);
    const id     = clean_(data.submissionId, 64);
    const picked = (Array.isArray(data.events) ? data.events : []).filter(function (x) { return EVENTS.indexOf(x) > -1; });

    if (!name)                                   return json_({ ok: false, error: 'Name is required' });
    if (phone.replace(/\D/g, '').length < 8)     return json_({ ok: false, error: 'Valid mobile number is required' });
    if (!(guests >= 1 && guests <= MAX_GUESTS))  return json_({ ok: false, error: 'Guests must be 1–' + MAX_GUESTS });
    if (!picked.length)                          return json_({ ok: false, error: 'Select at least one event' });

    const sheet = getSheet_();

    // ----- ignore accidental double-submits (same Submission ID) -----
    if (id && sheet.getLastRow() > 1) {
      const hit = sheet.getRange(2, COL_ID, sheet.getLastRow() - 1, 1)
                       .createTextFinder(id).matchEntireCell(true).findNext();
      if (hit) return json_({ ok: true, duplicate: true });
    }

    const row = [
      Utilities.formatDate(new Date(), TIME_ZONE, 'dd MMM yyyy, hh:mm a'),
      safe_(name), phone, guests,
      mark_(picked, 'Carnival Night'), mark_(picked, 'Cocktail Night'),
      mark_(picked, 'Wedding'), mark_(picked, 'Reception'),
      safe_(msg), id
    ];

    const r = sheet.getLastRow() + 1;
    sheet.getRange(r, COL_PHONE).setNumberFormat('@');   // keep +91 / leading zeros intact
    sheet.getRange(r, 1, 1, row.length).setValues([row]);
    return json_({ ok: true });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/** Opening the Web App URL in a browser shows this — handy to test the deployment. */
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint is live. Submissions must be sent with POST.' });
}

/** Run ONCE from the editor: creates the RSVPs tab, headers and a Summary tab. */
function setup() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
       .setFontWeight('bold').setBackground('#f2e5d7');
  sheet.setFrozenRows(1);
  sheet.getRange(1, COL_PHONE, sheet.getMaxRows(), 1).setNumberFormat('@');
  sheet.setColumnWidths(1, HEADERS.length, 130);
  sheet.setColumnWidth(9, 300);

  let sum = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  sum.clear();
  sum.getRange(1, 1, 1, 3).setValues([['Event', 'RSVPs (parties)', 'Total guests']])
     .setFontWeight('bold').setBackground('#f2e5d7');
  ['E', 'F', 'G', 'H'].forEach(function (col, i) {
    const r = i + 2;
    sum.getRange(r, 1, 1, 3).setFormulas([[
      EVENTS[i],
      '=COUNTIF(' + SHEET_NAME + '!' + col + ':' + col + ',"Yes")',
      '=SUMIF(' + SHEET_NAME + '!' + col + ':' + col + ',"Yes",' + SHEET_NAME + '!D:D)'
    ]]);
  });
  sum.autoResizeColumns(1, 3);
}


/* ----------------------------- helpers ----------------------------- */
function getSpreadsheet_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}
function getSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { setup(); sheet = ss.getSheetByName(SHEET_NAME); }
  return sheet;
}
function clean_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max); }
// stops a guest typing  =HYPERLINK(...)  etc. into your sheet
function safe_(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
function mark_(list, name) { return list.indexOf(name) > -1 ? 'Yes' : ''; }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
