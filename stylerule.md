# Fixly - Styling & Design System Rules (`stylerule.md`)

> **Theme Aesthetic:** Crisp Solid White Background with a vibrant, high-contrast palette of **Solid Pink, Blue, Purple, Green, and Yellow** color blocks.  
> **Geometry Rule:** **Strictly NO Pill Elements** (`rounded-full` is prohibited). All components use crisp rectangular or subtle square-box geometry (`rounded-none`, `rounded-sm`, or `rounded-md`).

---

## 1. Core Color Palette & Solid Color Roles

Fixly utilizes a clean, high-contrast **Solid Color Block** design language on a pure white canvas. All colors are opaque and solid (no muddy gradients or low-opacity blurs).

| Color Role | Solid Hex / Tailwind Token | Foreground Text | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `#ffffff` (`bg-white`) | `#09090b` (`text-zinc-950`) | Primary application viewport and page background |
| **Card / Container Surface** | `#ffffff` / `#f8fafc` / `#f4f4f5` | `#09090b` (`text-zinc-950`) | Standard content containers with solid borders |
| **Solid Blue** | `#2563eb` (`bg-blue-600`) | `#ffffff` (`text-white`) | Primary actions, appliance/gadget categories, In-Progress status |
| **Solid Purple** | `#7c3aed` (`bg-purple-600`) | `#ffffff` (`text-white`) | Technician badges, verified badges, analytics highlights |
| **Solid Pink** | `#ec4899` (`bg-pink-600`) / `#f43f5e` | `#ffffff` (`text-white`) | Featured offers, callouts, urgent alerts, favorites |
| **Solid Green** | `#16a34a` (`bg-green-600`) | `#ffffff` (`text-white`) | Completed repairs, accepted quotes, positive ratings |
| **Solid Yellow** | `#facc15` (`bg-yellow-400`) | `#000000` (`text-black`) | Pending requests, quote reviews, star ratings, notices |
| **Solid Black / Dark Zinc** | `#000000` (`bg-black`) / `#18181b` | `#ffffff` (`text-white`) | Primary text, high-contrast solid buttons, headers |
| **Borders & Dividers** | `#e4e4e7` / `#18181b` (`border-zinc-200` / `border-black`) | N/A | Crisp dividing lines, card outlines, table borders |
| **Muted / Secondary Text** | `#52525b` / `#71717a` (`text-zinc-600`) | N/A | Subheadings, descriptions, secondary metadata |

---

## 2. Geometric Rules: STRICTLY NO PILLS

* 🚫 **`rounded-full` is strictly prohibited** on buttons, badges, tags, inputs, cards, search bars, and avatars.
* ✅ **Permitted Border Radii:**
  * `rounded-none` (0px) — Sharp neo-brutalist / modern geometric box edges.
  * `rounded-sm` (2px / 0.125rem) — Crisp tags, badges, input controls.
  * `rounded-md` (6px / 0.375rem) — Cards, dialog modals, containers.
* **Avatars & Icons:** Must be square or subtle rounded-sm (`rounded-md` or `rounded-none`, never circular `rounded-full`).
* **Badges & Tags:** Rectangular block format (e.g. `rounded-sm px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide`).

---

## 3. Typography & Hierarchy

* **Font Family:** `Geist Variable`, `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Hierarchy:**
  * **Hero / Main Title:** `text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950`
  * **Section Heading:** `text-xl sm:text-2xl font-bold tracking-tight text-zinc-900`
  * **Card Title:** `text-lg font-bold text-zinc-900`
  * **Body Copy:** `text-sm sm:text-base font-normal text-zinc-700 leading-relaxed`
  * **Meta / Subtext:** `text-xs font-medium text-zinc-500`
  * **Badge Text:** `text-xs font-bold uppercase tracking-wider`

---

## 4. Component Rules & Solid Block Patterns

### 4.1. Buttons & Action Triggers
Buttons must have crisp rectangular edges (`rounded-md` or `rounded-sm`), bold weight, and solid color backgrounds.

```jsx
// Primary Action (Solid Black or Solid Blue)
<Button className="rounded-md bg-black text-white hover:bg-zinc-800 font-semibold px-5 py-2.5 shadow-sm">
  Request Repair
</Button>

// Category / Feature CTA (Solid Blue)
<Button className="rounded-md bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2">
  Find Technicians
</Button>

// Urgent / Highlight CTA (Solid Pink)
<Button className="rounded-md bg-pink-600 text-white hover:bg-pink-700 font-semibold">
  Get Fast Quote
</Button>

// Outline / Secondary Action
<Button variant="outline" className="rounded-md border-2 border-zinc-900 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold">
  View Details
</Button>
```

### 4.2. Status Badges & Category Labels (No Pills)
Always use rectangular badges with solid color blocks and clear contrast:

* **Pending Quote:**
  ```jsx
  <Badge className="rounded-sm bg-yellow-400 text-black border border-yellow-500 font-bold uppercase text-[11px] px-2 py-0.5">
    Pending Quote
  </Badge>
  ```
* **Accepted / In-Progress:**
  ```jsx
  <Badge className="rounded-sm bg-blue-600 text-white font-bold uppercase text-[11px] px-2 py-0.5">
    In-Progress
  </Badge>
  ```
* **Completed / Verified:**
  ```jsx
  <Badge className="rounded-sm bg-green-600 text-white font-bold uppercase text-[11px] px-2 py-0.5">
    Completed
  </Badge>
  ```
* **Rejected / Cancelled:**
  ```jsx
  <Badge className="rounded-sm bg-rose-600 text-white font-bold uppercase text-[11px] px-2 py-0.5">
    Rejected
  </Badge>
  ```
* **Specialty / Technician Tag (Purple):**
  ```jsx
  <Badge className="rounded-sm bg-purple-600 text-white font-bold uppercase text-[11px] px-2 py-0.5">
    Electronics Expert
  </Badge>
  ```

### 4.3. Cards & Container Blocks
* White background with solid borders, subtle contrast, and clean block headers.
* Never use circular avatar icons; use square or `rounded-md` avatars.
```jsx
<Card className="rounded-md bg-white border border-zinc-200 shadow-sm overflow-hidden">
  <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 p-4">
    <div className="flex items-center justify-between">
      <CardTitle className="text-zinc-900 font-bold">Laptop Screen Repair</CardTitle>
      <Badge className="rounded-sm bg-blue-600 text-white font-semibold">Electronics</Badge>
    </div>
    <CardDescription className="text-zinc-600 mt-1">Estimated: ₹1,500 - ₹3,000</CardDescription>
  </CardHeader>
  <CardContent className="p-4 text-zinc-700">
    {/* Body */}
  </CardContent>
</Card>
```

### 4.4. Category Cards (Solid Vibrant Accents)
Each repair category is differentiated with a distinct solid color theme banner or icon block:
* **Smartphones & Laptops:** Solid Blue accent (`bg-blue-600 text-white`)
* **Home Appliances (AC, Fridge, Washing Machine):** Solid Purple accent (`bg-purple-600 text-white`)
* **Kitchen & Small Electronics:** Solid Pink accent (`bg-pink-600 text-white`)
* **Watches & Audio Gear:** Solid Yellow accent (`bg-yellow-400 text-black`)
* **Furniture & General Repairs:** Solid Green accent (`bg-green-600 text-white`)

### 4.5. Forms & Inputs
* Solid white background with crisp dark borders:
```jsx
<Input className="rounded-md bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent" />
```

---

## 5. CSS Variables Mapping (Solid White + Vibrant Palette)

In `src/index.css`, `:root` is configured with a pure white background and high-contrast dark foreground:

```css
:root {
  --background: oklch(1 0 0);           /* Pure Solid White #ffffff */
  --foreground: oklch(0.12 0 0);        /* Deep Black / Zinc #18181b */
  --card: oklch(1 0 0);                 /* Pure Solid White */
  --card-foreground: oklch(0.12 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.12 0 0);
  --primary: oklch(0.12 0 0);           /* Solid Black CTA */
  --primary-foreground: oklch(1 0 0);   /* White Text */
  --secondary: oklch(0.96 0 0);         /* Crisp Light Surface */
  --secondary-foreground: oklch(0.12 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.45 0 0);  /* Dark Neutral #52525b */
  --accent: oklch(0.96 0 0);
  --accent-foreground: oklch(0.12 0 0);
  --destructive: oklch(0.55 0.22 25);   /* Solid Rose */
  --border: oklch(0.88 0 0);            /* Crisp Light Border #e4e4e7 */
  --input: oklch(0.88 0 0);
  --ring: oklch(0.5 0.2 250);           /* Vibrant Blue Focus Ring */
  --radius: 0.375rem;                   /* 6px max - NO PILLS */
}
```

---

## 6. Developer Checklist
1. ❌ **Never** write `rounded-full` anywhere in JSX classes.
2. ✅ Use `rounded-none`, `rounded-sm`, or `rounded-md` exclusively.
3. ✅ Use solid vibrant color blocks (Pink, Blue, Purple, Green, Yellow, Black) for category cards, badges, and status indicators.
4. ✅ Keep the canvas pure solid white (`bg-white`) with high-contrast text (`text-zinc-900` / `text-zinc-700`).
5. ✅ Always check that icons inside buttons use `data-icon` and follow shadcn composition guidelines.
