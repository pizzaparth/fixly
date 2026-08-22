# Fixly - Styling & Design System Rules (`stylerule.md`)

> **Theme Aesthetic:** Deep Solid Black (OLED / Pitch Black) with high-contrast Crisp White typography, Light Grey accents/secondary text, and subtle dark zinc borders.

---

## 1. Core Color Palette & Design Tokens

Fixly is strictly styled with a minimalist, high-contrast **Solid Black** aesthetic.

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| **Canvas / Background** | `#000000` / `oklch(0 0 0)` | True solid black for primary viewport background |
| **Card / Surface** | `#09090b` / `oklch(0.12 0 0)` | Slightly elevated dark surface for cards, dialogs, dropdowns |
| **Subtle Surface** | `#121215` / `oklch(0.16 0 0)` | Hover states, tab backgrounds, secondary action containers |
| **Border / Divider** | `#27272a` / `oklch(0.24 0 0)` | Crisp subtle border dividing layout sections and cards |
| **Primary Text** | `#ffffff` / `oklch(1 0 0)` | High-contrast white for headings, primary text, and active titles |
| **Secondary Text** | `#a1a1aa` / `oklch(0.72 0 0)` | Light grey for body copy, labels, descriptions, sub-headings |
| **Muted Text / Placeholder** | `#71717a` / `oklch(0.55 0 0)` | Subtle grey for timestamps, metadata, input placeholders |
| **Primary Element / CTA** | `#ffffff` text on `#000000` or `#ffffff` bg with `#000000` text | High-contrast primary action buttons |
| **Secondary Element** | `#27272a` bg with `#ffffff` text | Secondary actions, badges, toggle triggers |
| **Destructive / Alert** | `#ef4444` / `oklch(0.6 0.22 25)` | Rejection warnings, deletion actions, validation errors |
| **Success / Confirmation** | `#22c55e` / `oklch(0.7 0.18 145)` | Completed repairs, accepted quotes, status indicators |
| **Warning / Pending** | `#eab308` / `oklch(0.75 0.16 85)` | Pending review states, quote approval notices |

---

## 2. Typography & Fonts

* **Font Family:** `Geist Variable`, `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Hierarchy:**
  * **Page Title / Hero:** `text-3xl sm:text-4xl font-bold tracking-tight text-white`
  * **Section Heading:** `text-xl sm:text-2xl font-semibold tracking-tight text-white`
  * **Card Title:** `text-lg font-semibold text-white`
  * **Body / Standard Copy:** `text-sm sm:text-base text-zinc-300` (light grey readability)
  * **Subtext / Helper Text:** `text-xs text-zinc-400`
  * **Badge / Label Text:** `text-xs font-medium text-zinc-200 uppercase tracking-wider`

---

## 3. Component & Layout Rules (Strict shadcn/Tailwind Guidelines)

### 3.1. Layout & Spacing
* **Flexbox & Grid Gaps:** Always use `gap-*` (e.g. `flex flex-col gap-4` or `grid gap-6`). **Never** use `space-x-*` or `space-y-*`.
* **Equal Dimensions:** Always use `size-*` for square elements/avatars/icons (e.g., `size-10`, `size-4`) instead of `w-10 h-10`.
* **Truncation:** Use the `truncate` utility instead of manual multi-class overflow rules.
* **Containers:** Use max-width containers with centered margin (e.g. `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).

### 3.2. Cards & Surfaces
* Cards must use solid dark surfaces with subtle borders:
  ```jsx
  <Card className="bg-zinc-950 border-zinc-800 text-white shadow-none">
    <CardHeader>
      <CardTitle className="text-white">Technician Details</CardTitle>
      <CardDescription className="text-zinc-400">Verified repair expert</CardDescription>
    </CardHeader>
    <CardContent className="text-zinc-300">
      {/* Content */}
    </CardContent>
  </Card>
  ```
* Always use the full composition: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`.

### 3.3. Buttons & Interactive Controls
* **Primary Button:** White background with black text for maximum emphasis:
  ```jsx
  <Button className="bg-white text-black hover:bg-zinc-200 font-medium">
    Request Repair
  </Button>
  ```
* **Secondary / Outline Button:** Dark zinc outline or background with crisp white text:
  ```jsx
  <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800 hover:text-white">
    View Quotes
  </Button>
  ```
* **Ghost Button:** `text-zinc-400 hover:text-white hover:bg-zinc-900`
* **Icons in Buttons:** Use `data-icon="inline-start"` or `data-icon="inline-end"` without redundant sizing classes.

### 3.4. Forms & Inputs
* Always compose forms using `FieldGroup` + `Field` with `<Label className="text-zinc-300">`.
* Input surfaces must be dark with subtle borders and clear focus rings:
  ```jsx
  <Input className="bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400" />
  ```
* Use `data-invalid` on `Field` and `aria-invalid` on the input element for error states.

### 3.5. Status Badges & Indicators
* Use `Badge` components with high-contrast dark variants:
  * **Pending:** `bg-amber-500/10 text-amber-400 border border-amber-500/20`
  * **In-Progress:** `bg-blue-500/10 text-blue-400 border border-blue-500/20`
  * **Completed:** `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
  * **Rejected:** `bg-rose-500/10 text-rose-400 border border-rose-500/20`
  * **Neutral / Category:** `bg-zinc-800 text-zinc-300 border border-zinc-700`

### 3.6. Overlays, Dialogs & Sheets
* Modals, sheets, and alert dialogs must have `DialogTitle` / `SheetTitle` for accessibility (use `className="sr-only"` if hidden).
* Overlay backdrop: `bg-black/80 backdrop-blur-sm`.
* Modal surface: `bg-zinc-950 border border-zinc-800 text-white`.

---

## 4. CSS Variables Mapping (Solid Black Theme)

In `src/index.css`, the root theme values are configured to true black:

```css
:root {
  --background: oklch(0 0 0);           /* Solid Pitch Black */
  --foreground: oklch(0.985 0 0);       /* Pure White */
  --card: oklch(0.1 0 0);               /* Deep Dark Surface #09090b */
  --card-foreground: oklch(0.985 0 0);  /* Pure White */
  --popover: oklch(0.1 0 0);            /* Deep Dark Surface */
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);          /* Pure White */
  --primary-foreground: oklch(0 0 0);   /* Pure Black */
  --secondary: oklch(0.2 0 0);          /* Dark Zinc #27272a */
  --secondary-foreground: oklch(0.95 0 0); /* Light Grey / White */
  --muted: oklch(0.18 0 0);             /* Muted Dark Background */
  --muted-foreground: oklch(0.7 0 0);   /* Light Grey Text #a1a1aa */
  --accent: oklch(0.2 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.6 0.22 25);
  --border: oklch(0.24 0 0);            /* Dark Border #27272a */
  --input: oklch(0.24 0 0);
  --ring: oklch(0.8 0 0);               /* Subtle Bright Focus Ring */
  --radius: 0.5rem;
}
```

---

## 5. Golden Rules for Developers
1. **Never use bright generic colors** (e.g. `bg-blue-500`, `bg-purple-600`) for primary layout containers. Stick to monochrome solid black, charcoal, zinc, and crisp white.
2. **Never leave text unstyled or with low contrast.** Primary headings must be pure white (`text-white`), body copy light grey (`text-zinc-300` / `text-zinc-400`).
3. **Use semantic components first.** Use `Badge`, `Card`, `Separator`, `Skeleton`, `Dialog`, `Button` from shadcn rather than custom `div`s.
4. **Conditional classes must use `cn()`** from `@/lib/utils`.
