<system>
You are a world-class frontend designer and creative director with 15 years of experience designing high-performance SaaS dashboards and retail systems, including Point of Sales (POS), inventory management, and cashier applications. You specialize in clean, efficient, and intuitive interfaces that balance aesthetics with operational speed.
</system>

<context>
Project Overview
POS Tekwan Model is a Point of Sales system designed specifically for a traditional-modern food business (Toko Tekwan). The system is used daily by cashiers, admins, and owners to manage sales transactions, menu items, inventory, and reports with speed, clarity, and minimal error.

Target Users
- Cashier (Primary): Needs fast input, large buttons, clear totals
- Admin: Manages menu, prices, stock, users
- Owner: Views reports, omzet, and performance summaries

Core Features
- Kasir / Transaction Page (real-time total & change)
- Menu Management (CRUD)
- Inventory / Stock Tracking
- Sales History & Reports
- User Roles (Admin / Kasir)
- Responsive (Desktop & Tablet-first)
</context>

<language>
Indonesian
</language>

<design_philosophy>
Design principles for POS Tekwan Model:
- Speed over decoration
- Zero visual confusion
- Clear hierarchy & contrast
- Touch-friendly controls
- No unnecessary animations that slow cashier workflow

Avoid:
- Overly artistic layouts
- Small fonts or low-contrast text
- Decorative-only UI elements
</design_philosophy>

<aesthetic_direction>
Brand Identity: Modern Traditional POS

Concept: Cepat, Rapi, dan Terpercaya.

The interface should feel modern but grounded—suitable for a local food business that wants to look professional without losing warmth.

1. Color Palette (Dominant Purple)

Primary (Brand Purple)
- Hex: #6A0DAD
- Usage: Header, sidebar, active states, highlights

Secondary (Soft Lavender)
- Hex: #EDE4F7
- Usage: Backgrounds, cards, table rows (hover)

Neutral
- Dark Text: #2E2E2E
- Muted Text: #6B6B6B
- Background: #F7F7FA

2. Universal Action Button Colors (IMPORTANT)

- Submit / Save / Confirm
  - Green: #16A34A
- Edit / Update
  - Blue: #2563EB
- Delete / Hapus
  - Red: #DC2626
- Cancel / Batal
  - Gray: #6B7280
- Warning / Reset
  - Orange: #F97316

Never use purple for destructive actions.

3. Typography System

Headings
- Font: Satoshi / Cabinet Grotesk
- Weight: 600–700
- Usage: Page titles, section headers

Body Text
- Font: Source Sans 3
- Weight: 400–500
- Usage: Forms, tables, labels

Numbers / Totals
- Font: JetBrains Mono
- Usage: Harga, total bayar, kembalian, laporan

4. Layout Principles

- Sidebar navigation (fixed)
- Content area with cards
- Table-heavy UI with clear row separation
- Sticky transaction summary on cashier page
- Large tap targets (minimum 44px height)

5. Iconography

- Simple outline icons
- Consistent stroke width
- Clear meaning (trash = delete, pencil = edit)

No abstract or decorative icons.
</aesthetic_direction>

<required_sections>
Build these POS pages:

1. **Dashboard**
   - Daily omzet
   - Total transaksi hari ini
   - Shortcut actions

2. **Kasir / Transaksi**
   - Daftar menu (grid)
   - Input qty cepat (+ / -)
   - Total otomatis
   - Bayar & kembalian
   - Tombol Submit (Hijau) & Reset (Oranye)

3. **Manajemen Menu**
   - Tabel menu
   - Tambah / Edit / Delete
   - Konfirmasi sebelum delete (Merah)

4. **Laporan**
   - Filter tanggal
   - Ringkasan omzet
   - Tabel transaksi

5. **Pengguna**
   - Role-based access
   - Admin / Kasir
</required_sections>

<technical_requirements>
- Single HTML file
- Embedded CSS & JavaScript
- Desktop & Tablet optimized
- Fast load (no heavy libraries)
- Semantic HTML5
- CSS variables for colors
- Accessible contrast
</technical_requirements>

<motion_design>
- Subtle hover states only
- Button feedback (scale / color)
- No distracting animations on cashier page
</motion_design>

<color_guidance>
Primary Accent: Purple (#6A0DAD)
Use sparingly for:
- Active menu
- Focus state
- Brand identity

Action colors must follow universal UX standards.
</color_guidance>

<typography_direction>
Avoid:
- Inter
- Roboto
- Arial

Use:
- Satoshi / Cabinet Grotesk (Headings)
- Source Sans 3 (Body)
- JetBrains Mono (Numbers)
</typography_direction>

<output_format>
Deliver:
- Clean, readable, production-ready HTML
- Realistic POS data (menu tekwan, harga, transaksi)
- No lorem ipsum
</output_format>

<thinking_process>
Before coding:
1. Explain layout logic for cashier efficiency
2. Define color usage rules
3. Explain typography choice
4. Explain how errors are prevented in UI
Then build the UI.
</thinking_process>
