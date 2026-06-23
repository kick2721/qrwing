# Dynamic QR Codes & Pro Plan Editing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Free users get static QR codes (content encoded directly), Pro users get dynamic QR codes (editable via `r/[id]` redirect with scan tracking).

**Architecture:** Extract form fields from QRGenerator into a shared QRForm component used by both QRGenerator (create) and EditModal (edit). QRForm accepts optional `onChange` (live preview) and `onSubmit` (save button). Gate static vs dynamic behavior in POST by plan. New PATCH endpoint for editing.

**Tech Stack:** Next.js App Router, Supabase (Postgres), qrcode.react

---

### Task 1: Gate static vs dynamic QR by plan in POST

**Files:**
- Modify: `src/app/api/qrcodes/route.ts`

- [ ] **Replace unconditional redirect overwrite with plan-gated logic**

Current code (lines 36-49) always overwrites content with `/r/[id]`. Change to:
- Free: store content as-is, redirect_to = null, no redirect URL
- Pro: same as current (content = `/r/[id]`, redirect_to = actualContent)

```typescript
  const actualContent = redirect_to || content;

  const rows = await query(
    `INSERT INTO public.qrcodes (user_id, type, content, label, config, redirect_to) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [session.user.id, type, content, label || "", JSON.stringify(config || {}), plan === "pro" ? actualContent : null]
  );

  const qr = rows[0];

  if (plan === "pro") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://qrwing.vercel.app";
    const redirectUrl = `${baseUrl}/r/${qr.id}`;
    await query(`UPDATE public.qrcodes SET content = $1 WHERE id = $2`, [redirectUrl, qr.id]);
    return NextResponse.json({ ...qr, content: redirectUrl, redirect_to: actualContent }, { status: 201 });
  }

  return NextResponse.json({ ...qr, content: actualContent, redirect_to: null }, { status: 201 });
```

- [ ] **Build to verify**

Run: `npm run build` — Expected: Compiles successfully

- [ ] **Commit**
```
git add src/app/api/qrcodes/route.ts
git commit -m "feat: gate static/dynamic QR by plan in POST"
```

---

### Task 2: Create PATCH /api/qrcodes/[id] for Pro editing

**Files:**
- Modify: `src/app/api/qrcodes/[id]/route.ts`

- [ ] **Add PATCH handler after DELETE**

```typescript
import { getUserPlan } from "@/lib/plan";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await getUserPlan();
  if (plan !== "pro") return NextResponse.json({ error: "Pro plan required" }, { status: 402 });

  const { id } = await params;
  const { type, redirect_to, label, config } = await req.json();

  const rows = await query(
    `UPDATE public.qrcodes SET type = $1, redirect_to = $2, label = $3, config = $4 WHERE id = $5 AND user_id = $6 RETURNING *`,
    [type, redirect_to, label || "", JSON.stringify(config || {}), id, session.user.id]
  );

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
```

- [ ] **Build to verify** — `npm run build`

- [ ] **Commit**
```
git add src/app/api/qrcodes/[id]/route.ts
git commit -m "feat: add PATCH endpoint for Pro QR editing"
```

---

### Task 3: Create shared QRForm component

**Files:**
- Create: `src/components/QRForm.tsx`
- Modify: `src/components/QRGenerator.tsx`

- [ ] **Write QRForm component**

QRForm manages all form state (type selector, URL/text/wifi/vcard/email/image inputs, colors, logo, size, image upload with trial). Props:

```typescript
interface Props {
  initialValues?: QRFormInitialValues;
  onChange?: (data: QRFormData) => void;   // fires on every change (for live preview)
  onSubmit?: (data: QRFormData) => Promise<void>; // if set, renders save button
  submitLabel?: string;
  saving?: boolean;
}

export interface QRFormData {
  type: QrType;
  content: string;
  redirect_to: string;
  label: string;
  config: any;
  hasValues: boolean;
}
```

The component copies the entire form section from QRGenerator.tsx (type buttons, input fields per type, image upload/trial logic, customization details, size selector) plus the submit button when `onSubmit` is provided.

Internal logic includes: `qrValue()` to compute the QR content string, `useEffect` to call `onChange`, image compression/upload, trial timer.

- [ ] **Rewrite QRGenerator.tsx to use QRForm**

Strip the form fields, keep only:
- QR preview (QRCodeCanvas + QRCodeSVG)
- Download/copy buttons
- Save button → calls QRForm's onSubmit with current data
- Free plan limit card

```typescript
export default function QRGenerator() {
  const [qrData, setQrData] = useState<QRFormData | null>(null);
  // ... saveQR, downloadQR, copyToClipboard ...
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <QRForm onChange={setQrData} onSubmit={saveQR} submitLabel={t("save")} saving={saving} />
      </div>
      <div>
        {/* QR preview + download/copy buttons */}
      </div>
    </div>
  );
}
```

Note: `saveQR` is called by QRForm's `onSubmit` — it receives `QRFormData` as argument.

- [ ] **Build to verify** — `npm run build`

- [ ] **Commit**
```
git add src/components/QRForm.tsx src/components/QRGenerator.tsx
git commit -m "feat: extract QRForm component, simplify QRGenerator"
```

---

### Task 4: Build EditModal component

**Files:**
- Create: `src/components/EditModal.tsx`

- [ ] **Write EditModal component**

Modal with QRForm pre-filled from existing QR data. Contains `parseQRValues(qr)` to convert stored data back to form fields.

```typescript
interface Props {
  qr: QRCodeData;
  onClose: () => void;
  onSaved: () => void;
}
```

`parseQRValues` parses `redirect_to` based on `type`:
- url → `{ type: "url", url: content }`
- text → `{ type: "text", text: content }`
- wifi → parse SSID/pass/enc from WIFI:T:... string
- vcard → parse FN/TEL/EMAIL from vCard format
- email → parse to/subject/body from mail URL params
- image → `{ type: "image", imageUploadedUrl: content }`

EditModal renders QRForm with `initialValues={parseQRValues(qr)}` and `onSubmit={handleSubmit}` that calls `PATCH /api/qrcodes/[id]`.

- [ ] **Build to verify** — `npm run build`

- [ ] **Commit**
```
git add src/components/EditModal.tsx
git commit -m "feat: add EditModal for Pro QR editing"
```

---

### Task 5: Wire EditModal into Dashboard

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Add edit button + modal to dashboard**

For each QR in the list:
- Add "Edit" button (visible only if plan is "pro")
- On click: open EditModal with that QR's data
- On save: close modal, refresh QR list + stats

Add state: `editQR: QRCodeData | null`

In the QR card (inside the action buttons area near delete button):
```
{plan === "pro" && (
  <button onClick={e => { e.stopPropagation(); setEditQR(qr); }}
    className="text-blue-400 hover:text-blue-600 text-sm px-2 py-1 ...">
    ✏️ {t("editQR")}
  </button>
)}
```

After the deleteConfirm modal:
```
{editQR && <EditModal qr={editQR} onClose={() => setEditQR(null)} onSaved={() => { setEditQR(null); fetchQRCodes(); }} />}
```

Add new translation keys to i18n.ts:
- `editQR: "Edit QR"` (for now, English only, can translate later)

- [ ] **Build to verify** — `npm run build`

- [ ] **Commit**
```
git add src/app/dashboard/page.tsx
git commit -m "feat: wire EditModal into dashboard for Pro users"
```

---

### Task 6: Build, verify & push

- [ ] **Final build check**
```
npm run build
```
Expected: All pages compile, no TypeScript errors

- [ ] **Push to master**
```
git push origin master
```
