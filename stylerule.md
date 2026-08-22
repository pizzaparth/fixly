# Fixly - Styling & Design System Rules (`stylerule.md`)

> **Theme Aesthetic:** Crisp Solid White Canvas with a vibrant palette of **Solid Pink, Blue, Purple, Green, Yellow, and Black** color blocks.  
> **Universal Geometry Rule:** **100% Rounded Aesthetics & Pill Elements** (`rounded-full` for navbar, buttons, badges, chips, search bar, and inputs; `rounded-3xl` / `rounded-2xl` for cards and modals).

---

## 1. Universal Rounded Design Language

Fixly utilizes smooth, fully rounded geometry across all user interfaces:
* **Navbar:** `rounded-full` floating container taking full container width (`max-w-7xl px-4 sm:px-6 lg:px-8`).
* **Buttons & Action Controls:** `rounded-full` with bold typography and high-contrast solid backgrounds.
* **Search Input:** `rounded-full` with spring-expanding width animation on focus/click.
* **Badges, Tags & Category Chips:** `rounded-full` pill badges with clear status colors.
* **Cards & Containers:** `rounded-3xl` or `rounded-2xl` with crisp 2px solid dark borders.
* **Modals & Dialogs:** `rounded-3xl` white surfaces with `rounded-full` action triggers and close buttons.

---

## 2. Core Color Palette & Solid Color Roles

Fixly utilizes opaque solid color blocks on a pure white background:

| Color Role | Solid Hex / Tailwind Token | Foreground Text | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `#ffffff` (`bg-white`) | `#09090b` (`text-zinc-950`) | Primary application viewport and page background |
| **Card / Surface** | `#ffffff` / `#f8fafc` / `#f4f4f5` | `#09090b` (`text-zinc-950`) | Clean content containers with solid borders |
| **Solid Blue** | `#2563eb` (`bg-blue-600`) | `#ffffff` (`text-white`) | Primary actions, appliance/gadget categories, In-Progress status |
| **Solid Purple** | `#7c3aed` (`bg-purple-600`) | `#ffffff` (`text-white`) | Technician badges, verified badges, partner network |
| **Solid Pink** | `#ec4899` (`bg-pink-600`) / `#f43f5e` | `#ffffff` (`text-white`) | Write Feedback triggers, urgent notices |
| **Solid Green** | `#16a34a` (`bg-green-600`) | `#ffffff` (`text-white`) | Completed repairs, accepted quotes, positive ratings |
| **Solid Yellow** | `#facc15` (`bg-yellow-400`) | `#000000` (`text-black`) | Pending requests, quote reviews, star ratings |
| **Solid Black / Dark Zinc** | `#000000` (`bg-black`) / `#18181b` | `#ffffff` (`text-white`) | Primary headers, high-contrast buttons, active tab indicators |
| **Borders & Dividers** | `#e4e4e7` / `#18181b` (`border-zinc-200` / `border-zinc-900`) | N/A | Crisp dividing outlines and card borders |

---

## 3. Component & Layout Rules

### 3.1. Navbar Layout & Responsiveness
* Floating sticky header: `className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"`
* Shape: `rounded-full bg-white/95 backdrop-blur-md border-2 border-zinc-900 shadow-sm`
* Mobile Collapsible: Hamburger menu button toggles an animated mobile drawer/panel on viewports below `md`.
* Role-specific Navigation:
  * **Customer Mode (`role: 'customer'`):** Displays "Home" and "My Repairs" (no "List Shop").
  * **Repair Shop Mode (`role: 'shop'`):** Displays "Home" and "Dashboard" (no "My Repairs").
  * **Guest / Signed Out:** Displays "Home", "List Shop", and "Sign In".

### 3.2. Homepage Listing Cards
* Listing cards take full horizontal width in a vertical stack (`flex flex-col gap-5 w-full`), allowing clear inspection of technician profile, rating, location distance, supported categories, and price estimate.
* Cards use `rounded-3xl` container boundaries with `border-2 border-zinc-900`.

### 3.3. Buttons & Action Triggers
```jsx
// Primary Action (Solid Black or Solid Blue)
<Button className="rounded-full bg-black text-white hover:bg-zinc-800 font-bold px-6 py-2.5 shadow-sm">
  Request Repair
</Button>
```

### 3.4. Badges & Category Chips
```jsx
<Badge className="rounded-full bg-blue-600 text-white font-bold px-3 py-1 text-xs">
  In-Progress
</Badge>
```

---

## 4. CSS Variables Mapping

In `src/index.css`:
```css
:root {
  --background: oklch(1 0 0);           /* Pure Solid White #ffffff */
  --foreground: oklch(0.12 0 0);        /* Deep Black / Zinc #18181b */
  --card: oklch(1 0 0);                 /* Pure Solid White */
  --card-foreground: oklch(0.12 0 0);
  --primary: oklch(0.12 0 0);           /* Solid Black CTA */
  --primary-foreground: oklch(1 0 0);   /* White Text */
  --radius: 1rem;                       /* Generous Rounded Theme */
}
```
