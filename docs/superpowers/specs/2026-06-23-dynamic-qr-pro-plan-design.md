# Dynamic QR Codes & Pro Plan Editing

## Problem
Currently all QR codes are dynamic (`content` = `r/[id]`, `redirect_to` = actual content). Free users should get static QR codes (content encoded directly, no editing/tracking). Pro users should get dynamic QR codes (editable, tracked) with the ability to modify all fields after creation.

## Solution Architecture

### Data Flow

```
CREATE (POST /api/qrcodes)
  Free  → content = actualValue, redirect_to = null
  Pro   → content = /r/[id],     redirect_to = actualValue

EDIT  (PATCH /api/qrcodes/[id])
  Pro only → updates redirect_to (and optionally label, config)
  content stays as /r/[id] (unchanged, printed QR still works)

REDIRECT (r/[id])
  Reads redirect_from → redirects/shows content
  Logs scan in public.scans (tracking)
```

### Components

**QRForm** (shared, extracted from QRGenerator)
- Same form fields as current QRGenerator (type selector, URL, text, wifi, vcard, email, image, colors, logo, size)
- Props: `initialValues?`, `onSubmit(values)`, `submitLabel`, `saving`
- Used by QRGenerator for CREATE and by EditModal for EDIT
- Handles image upload internally
- All existing behavior preserved (trial gating for image type, etc.)

**EditModal**
- Opened from dashboard with button on each Pro QR card
- Receives full QR data: `{ id, type, content, redirect_to, label, config }`
- Renders QRForm with `initialValues` = parsed current data
- On submit: `PATCH /api/qrcodes/[id]` with new values
- Close + refresh stats on success

### Backend Changes

**POST /api/qrcodes** (modified)
- If plan === "free": skip redirect URL overwrite, store content directly
- If plan === "pro": same as current behavior (content = r/[id], redirect_to = actual)

**PATCH /api/qrcodes/[id]** (new)
- Auth: requires session
- Plan: must be "pro" (402 if free)
- Updates: `type`, `redirect_to`, `label`, `config` (all fields editable)
  - `type` can be changed because `r/[id]` reads it from DB dynamically on each request
- Returns updated QR

### Database
- No schema changes needed. Existing `redirect_to` and `content` columns suffice.
- For static QRs: `redirect_to` = null, `content` = actual value
- For dynamic QRs: `content` = r/[id], `redirect_to` = actual value

### Dashboard Changes
- Static QRs (free): show badge "Static", no edit button
- Dynamic QRs (pro): show badge "Dynamic" + "Edit" button
- Edit button opens EditModal with QRForm
- After edit, refresh that QR's stats and list

### Edge Cases
- **Free user upgrades to Pro**: existing free QRs are already dynamic (created before this change). New QRs they create will also be dynamic. No migration needed.
- **Pro user downgrades to free**: existing dynamic QRs still work (r/[id] still resolves). They just can't create new dynamic QRs or edit existing ones.
- **Image QR editing**: trial system already in QRForm. If user has no active trial, edit shows the locked image upload UI same as create. Since editing is Pro-only, trial gating only affects image type.
- **Changing type**: allowed in edit. `r/[id]` reads `type` from DB dynamically on each request, so switching e.g. URL→Text works immediately.

### Files to Create/Modify
| File | Action |
|------|--------|
| `src/components/QRForm.tsx` | NEW — extracted form component |
| `src/components/QRGenerator.tsx` | MODIFY — use QRForm |
| `src/components/EditModal.tsx` | NEW — edit modal with QRForm |
| `src/app/dashboard/page.tsx` | MODIFY — add edit button + modal |
| `src/app/api/qrcodes/[id]/route.ts` | MODIFY — add PATCH handler |
| `src/app/api/qrcodes/route.ts` | MODIFY — gate static/dynamic by plan |
