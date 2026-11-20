# RSVP Functionality Documentation

## Overview
The RSVP system saves wedding guest responses to a Google Sheet via Google Apps Script Web App.

## How It Works

### 1. Configuration (config.js)
- `APPS_SCRIPT_URL`: The Google Apps Script Web App deployment URL
- `WHATSAPP_FALLBACK_NUMBER`: Optional phone number for WhatsApp backup (if form submission fails)

### 2. Form Fields (index.html)
- **Guest Name** (`r-name`): Required text field for the guest's full name
- **Mobile Number** (`r-phone`): Required phone field with minimum 8 digits validation
- **Number of Guests** (`r-guests`): Required number input (1-20)
- **Events** (`rsvp-events`): Checkboxes for 4 celebrations:
  - Carnival Night · 6 Jan
  - Cocktail Night · 7 Jan
  - Wedding · 9 Jan
  - Reception · 10 Jan
- **Message** (`r-message`): Optional textarea for blessings/notes (max 500 characters)
- **Honeypot** (`website`): Hidden field for spam protection - should remain empty

### 3. Validation Steps
When the form is submitted, these checks are performed in order:

1. **HTML5 Validation**: Ensures all required fields are filled
2. **Honeypot Check**: If the hidden "website" field has a value, submission is silently rejected (spam bot protection)
3. **Phone Validation**: Phone number must contain at least 8 digits
4. **Event Selection**: At least one event must be selected
5. **URL Configuration**: Apps Script URL must be properly configured in config.js

### 4. Data Submission
If validation passes:

**Payload Structure:**
```javascript
{
  name: "Guest Name",
  phone: "+91 98470 12345",
  guests: 2,
  events: ["Wedding", "Reception"],
  message: "Congratulations!",
  submissionId: "unique-uuid",
  page: "https://wedding-site.com/"
}
```

**HTTP Request:**
- Method: `POST`
- Content-Type: `text/plain;charset=utf-8` (avoids CORS preflight)
- Body: JSON stringified payload
- Timeout: 20 seconds
- Follows redirects

### 5. Response Handling

**Success (Apps Script returns `{ok: true}`):**
- Form is hidden
- Thank you message displays: "Thank you, [Name]! Your RSVP for [Events] has been received."
- New submission ID is generated for potential next submission

**Failure (Network error, timeout, or `{ok: false}`):**
- Error message displays
- If WhatsApp fallback is configured, shows "send on WhatsApp instead" link
- Button returns to normal state
- User can retry submission

### 6. Security Features

**Spam Protection:**
- Honeypot field traps automated bots
- Unique submission IDs prevent accidental duplicates

**Validation:**
- Client-side validation prevents invalid data
- Server-side validation should be added in Google Apps Script

**CORS Handling:**
- Uses `text/plain` content type to avoid CORS preflight requests
- Apps Script must be deployed with "Anyone" access

### 7. User Experience Features

**Loading State:**
- Button text changes to "Sending…"
- Button is disabled during submission
- Status area shows progress

**Accessibility:**
- Form fields have proper labels
- Status updates use `aria-live="polite"` for screen readers
- Error messages are clear and actionable

**Fallback Options:**
- WhatsApp link as backup if submission fails
- Formatted message ready to send

## Google Apps Script Integration

The Apps Script should:
1. Accept POST requests with JSON payload
2. Parse the JSON data
3. Append a new row to the Google Sheet
4. Return `{ok: true}` on success or `{ok: false, error: "message"}` on failure

Example Apps Script code is in `google-apps-script/Code.gs`

## Troubleshooting

**"RSVP is not connected yet"**
- Apps Script URL is missing or invalid in config.js
- Solution: Deploy the Apps Script and paste the URL into config.js

**"Please enter a valid mobile number"**
- Phone number has fewer than 8 digits
- Solution: Enter a complete phone number

**"Please select at least one celebration"**
- No event checkboxes are checked
- Solution: Select at least one event to attend

**"Sorry, we couldn't send your RSVP"**
- Network connection issue
- Apps Script is not responding
- Apps Script returned an error
- Solution: Check internet connection, verify Apps Script is deployed correctly, or use WhatsApp fallback
