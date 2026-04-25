## Barber Marketplace Admin Panel — UI Prototip

To'liq admin panel UI ni mock data bilan quramiz. Backend yo'q — barcha ma'lumotlar mahalliy mock fayllardan keladi.

### Dizayn yo'nalishi

- **Asosiy fon**: bejeviy (warm cream, `#F7F6F3` atrofida)
- **Aksent / matn**: qora va to'q kulrang
- **Sidebar**: bejeviy, faol element qora fonda oq matn
- **Kartalar**: oq ustida nozik kulrang chegara, bejeviy fonda kontrast
- **Status badgelari**: yashil (completed), sariq (in chair), qora (checked in), qizil (cancelled)
- **Shriftlar**: Outfit (sarlavhalar) + Manrope (matn)
- **Yumaloq burchaklar, matte soyalar, professional SaaS ko'rinish**

### Sahifalar (route'lar)

| Route | Tavsif |
|---|---|
| `/` → redirect `/admin` | Login skip, to'g'ridan-to'g'ri admin |
| `/admin` | Dashboard — KPI kartalar, region chart, oxirgi bookinglar |
| `/admin/users` | Mijozlar jadvali — qidiruv, region filter, active toggle, pagination |
| `/admin/barbers` | Sartaroshlar — qidiruv, region, active switch, delete dialog |
| `/admin/salons` | Salonlar — qidiruv, status filter (all/pending/published), delete |
| `/admin/bookings` | Bookinglar feed — sana, status, salon |
| `/admin/reviews` | Sharhlar — barber filter, min rating, sana oralig'i |
| `/admin/map` | Xarita — Leaflet bilan salon va barber markerlari, region filter |

### Layout & komponentlar

- **AdminLayout**: bejeviy fonli sidebar (ShearHQ logo) + top header (qidiruv + profil) + Outlet
- **Sidebar guruhlash**: "Operations" (Dashboard, Bookings, Map) va "Network" (Salons, Barbers, Users, Reviews)
- **Active route**: qora fon, oq matn
- **Mobil**: sidebar collapse bo'ladi (Sheet drawer)

### Qayta ishlatiladigan UI patternlar

- **DataTable**: sticky header, hover state, status badge ustuni, action dropdown
- **FilterToolbar**: qidiruv input + region select + status tugmalar guruhi
- **DeleteConfirmDialog**: target state pattern, "Bekor qilish" / "O'chirish"
- **StatusBadge**: variant prop (`pending | published | active | inactive | completed | in-chair`)
- **EmptyState**: ikon + xabar + CTA
- **Skeleton**: jadval va kartalar uchun loading
- **KPICard**: title, value, delta (%), trend rangi

### Mock data qatlami

`src/lib/mock-data.ts` ichida:
- `mockUsers` (50 ta), `mockBarbers` (40 ta), `mockSalons` (25 ta)
- `mockBookings` (60 ta), `mockReviews` (35 ta)
- `mockStats` (KPI'lar + region breakdown)
- `mockRegions` (Toshkent, Samarqand, Buxoro, Farg'ona, Namangan)

`src/lib/mock-api.ts` da soxta API funksiyalar (300ms delay bilan): `fetchAdminStats`, `fetchAdminUsers({q, region, page})`, `fetchAdminBarbers`, `fetchAdminSalons({q, region, published})`, `fetchAdminBookings`, `fetchAdminReviews`, va `patch*` / `delete*` funksiyalari (in-memory yangilanadi).

### Asosiy patternlar

- **TanStack Query**: `useQuery` + `queryKey: ["admin", "users", {page, q, region}]`
- **URL search params**: filter holati URL'da (`?q=...&region=...&page=2`) — `validateSearch` + zod
- **Mutation flow**: `patchAdminUser` → `invalidateQueries(["admin", "users"])` + toast
- **Pagination**: `pageSize=10`, `totalPages = ceil(count/pageSize)`, prev/next disabled
- **Xarita**: `react-leaflet` + dynamic import (SSR'siz), default markaz O'zbekiston, marker count > 1 bo'lsa `fitBounds`

### Texnik qism

- Stack: TanStack Start + TanStack Router + TanStack Query + Tailwind v4 + shadcn
- `src/styles.css`: yangi semantic tokenlar — `--background` (bejeviy), `--card` (oq), `--foreground` (qora), `--sidebar` (bejeviy), `--sidebar-accent` (qora), va status ranglar
- Yangi paketlar: `react-leaflet`, `leaflet`, `@tanstack/zod-adapter`, `zod`, `date-fns`, `sonner` (toast)
- Har bir route faylida `errorComponent` va `notFoundComponent`
- `__root.tsx`: `QueryClientProvider` wrapper + `Toaster`
- `/` route → `/admin` ga redirect

### Bajarish ketma-ketligi

1. Design tokenlarni `src/styles.css` ga qo'shish (bejeviy palette)
2. Mock data va mock-api fayllar
3. AdminLayout + Sidebar + AuthGuard (mock — har doim ok)
4. Reusable komponentlar: KPICard, StatusBadge, FilterToolbar, DeleteDialog, EmptyState
5. 7 ta route fayl + ularning page komponentlari
6. Map sahifasi (leaflet bilan)
7. `/` route redirect + Toaster
