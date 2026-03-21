# Order Risk Dashboard

A merchant-facing dashboard to monitor potentially risky COD orders and take actions. Built as part of the COD King Frontend Engineering Assignment.

## Setup

```bash
git clone https://github.com/rahulpuri02/codking-order-dashboard
cd order-risk-dashboard
pnpm install
pnpm dev
```

Create a `.env` file:

```
VITE_ORDERS_API_URL=https://cdn.shopify.com/s/files/1/0806/4876/5758/files/user_mock_data.json
```

## Architecture

```
src/
  features/order-risk/       # Main feature module
    components/              # Table, drawer, charts, cards, skeletons
    data/                    # Schema, risk calculation, data fetching
  components/
    ui/                      # shadcn/ui primitives
    data-table/              # Reusable table components (toolbar, pagination, filters)
    layout/                  # Sidebar, header, nav
  hooks/                     # URL state sync hook
  routes/                    # TanStack Router file-based routes
```

All order risk logic is self-contained in `src/features/order-risk/`. Risk score is calculated as `(cod_orders / total_orders) * 100` with thresholds at 70 (High Risk) and 40 (Medium Risk).

## Features

- **Analytics Cards** — Total orders, high risk count, COD percentage, average risk score
- **Data Table** — 7 columns with search, sorting, multi-column filtering, pagination
- **Order Details Drawer** — Customer info, COD vs prepaid breakdown, risk score bar
- **Action Buttons** — Send OTP, Force Prepaid, Mark Safe (optimistic UI updates)
- **Charts** — Risk distribution donut chart, COD vs Prepaid radar chart by top cities
- **URL-based Filters** — Filter state synced to URL search params
- **Loading Skeletons** — Shimmer placeholders matching actual layout
- **Empty States** — Friendly message when no orders match filters

## Libraries

| Library | Purpose |
|---------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool |
| TailwindCSS + shadcn/ui | Styling and components |
| TanStack Router | File-based routing with URL search param validation (Zod) |
| TanStack React Table | Data table with sorting, filtering, pagination |
| Recharts | Donut and radar charts |
| Lucide React | Icons |

## Assumptions

- Risk score is derived purely from COD order ratio — no server-side risk engine
- Actions (Send OTP, Force Prepaid, Mark Safe) are simulated locally with optimistic updates
- Mock data is fetched from a static Shopify CDN JSON endpoint
