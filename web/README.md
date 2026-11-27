# Бодь Рэйл — Next.js хувилбар

Репогийн root дахь HTML сайтыг Next.js (App Router) + Tailwind CSS + TypeScript руу шилжүүлж буй хувилбар.
Шилжилт дуусах хүртэл хоёулаа зэрэгцэн байна.

## Ажиллуулах

Node.js 20.9 буюу түүнээс дээш хувилбар шаардлагатай.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript шалгах
npm run build      # production build
```

## Хуудсууд

| URL | Файл |
|---|---|
| `/` | `app/page.tsx` |
| `/hudaldaa` | `app/hudaldaa/page.tsx` |
| `/uilchilgee` | `app/uilchilgee/page.tsx` |
| `/medee/<slug>` | `app/medee/[slug]/page.tsx`, агуулга нь Supabase-ийн `news` хүснэгт |
| `/hunii-nuuts` | `app/hunii-nuuts/page.tsx`, ажлын байр нь Supabase-ийн `jobs` хүснэгт, хангамж нь `content/jobs.ts`, анкетын талбарууд нь `lib/application.ts` |

## Хавтасны бүтэц

```
app/                 хуудсууд, layout (header + footer), globals.css (өнгө, фонт)
app/actions/         Server Action: маягтыг и-мэйлээр илгээх
components/layout/   SiteHeader, SiteFooter, Hero, PageHero, Brand
components/ui/       Button, Pill, Tag, Chip, Card, Section, SectionHead, Stats ...
components/sections/ Licenses, FleetCarousel, Timeline, PartnerLogos, NewsCard, Split ...
components/forms/    InquiryForm, Field, FormSection
content/             давтагддаг өгөгдөл: холбоо барих, цэс, зөвшөөрөл, хамтрагч, слайд
lib/                 туслах функцууд, Supabase-аас унших (data.ts, supabase.ts), маягтын тохиргоо
public/images/       зургууд
```

- **Өнгө өөрчлөх**: `app/globals.css` доторх `@theme`.
- **Слайд нэмэх**: `content/fleet.ts`.
- **Утас, хаяг өөрчлөх**: `content/site.ts`. Бүх хуудсанд нэг дор өөрчлөгдөнө.

## Админ хуудас (`/admin`)

Мэдээ, ажлын зар, түрээслүүлэх/худалдах хөдлөх бүрэлдэхүүн болон нүүр хуудасны үйлчилгээний картуудыг
`/admin` хуудаснаас нэмж, засаж, нууж, устгана. Хадгалсан өөрчлөлт сайтад шууд гарна.
Зургийг хуудаснаас оруулахад Supabase Storage-ийн `site-images` bucket-д хадгалагдана.

**Админ нэмэх:**
1. Supabase → Authentication → Users → **Add user** → **Create new user** (и-мэйл, нууц үг, *Auto Confirm User*).
2. SQL Editor дээр: `insert into public.admins (user_id, email) select id, email from auth.users where email = 'нэр@bodirail.mn';`

Нэвтэрсэн ч `admins` хүснэгтэд байхгүй хэрэглэгч юу ч засаж чадахгүй (RLS). Аюулгүй байдлын үүднээс
Authentication → Sign In / Providers хэсэгт **Allow new users to sign up**-ийг унтраахыг зөвлөж байна.

Код: `app/admin/` (хуудас, `actions.ts`), `components/admin/`, `lib/admin.ts`, `proxy.ts` (нэвтрэлтийн session).

## Supabase: агуулга ба анкет

Ажлын зар, мэдээ, бүтээгдэхүүн/үйлчилгээний картууд Supabase-аас уншигдана (`lib/data.ts`).
`/admin` хуудаснаас эсвэл Supabase dashboard → Table Editor дээр засна. Dashboard дээр засвал сайтад **1 минутын дотор** гарна.

| Хүснэгт | Юу | Тайлбар |
|---|---|---|
| `jobs` | Хүний нөөц хуудасны ажлын зар, анкетын "Албан тушаал" сонголт | `requires_driver_license`, `requires_rail_documents` нь анкетын заавал талбарыг тодорхойлно |
| `offerings` | Картууд | `section`: `home` = нүүр хуудасны "Бидний үйлчилгээ", `sale` = Худалдаа, `rental` = Түрээс. `body`-д мөр шилжүүлж бичиж болно, `details` нь жагсаалт |
| `news` | Мэдээ | `slug` нь `/medee/<slug>` хаяг. Зургийг `public/images/news/<slug>/` хавтсанд хийгээд `cover`, `gallery`-д замыг нь бичнэ |
| `inquiries` | Маягтаар ирсэн хүсэлт | `kind`: `service` = түрээс, үйлчилгээ, `quote` = худалдаа, `order` = тээврийн захиалга. `emailed` = и-мэйлээр очсон эсэх. Админ → Хүсэлт |
| `applications` | Ирсэн анкет | Хавсралт нь Storage → `applications` bucket-ийн `<id>/` хавтсанд. `status`: new / reviewed / rejected / hired |

- `sort_order` бага нь эхэнд харагдана. `is_active` (мэдээнд `is_published`) = false бол сайтаас нуугдана.
- Орчны хувьсагч: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (`.env.example`). Vercel дээр мөн нэмнэ.
- Publishable key нь RLS-ээр зөвхөн нийтийн агуулгыг унших, анкет нэмэхийг зөвшөөрнө. Анкетыг уншиж чадахгүй тул
  ирсэн анкетыг зөвхөн Supabase dashboard-оос харна.

## Маягт → и-мэйл

Гурван маягт (үнийн санал, тээврийн захиалга, үйлчилгээний хүсэлт) нь `app/actions/send-inquiry.ts` Server Action-аар
[Resend](https://resend.com) ашиглан `info@bodirail.mn` руу илгээгдэнэ.

1. resend.com дээр бүртгүүлж API key авна.
2. Resend → Domains хэсэгт `bodirail.mn`-ийг нэмж, өгсөн DNS бичлэгүүдийг домэйндээ оруулж баталгаажуулна.
3. Vercel → Project → Settings → Environment Variables хэсэгт `.env.example`-д байгаа хувьсагчдыг нэмнэ.
   Компьютер дээрээ туршихдаа `.env.example`-ийг `.env.local` нэрээр хуулж бөглөнө.

`RESEND_API_KEY` тохируулаагүй үед `npm run dev` горимд и-мэйл илгээхгүй, агуулгыг нь терминалд хэвлэнэ.

## Онлайн анкет → Supabase + и-мэйл

Хүний нөөц хуудасны анкет `app/actions/send-application.ts`-аар Supabase-ийн `applications` хүснэгт, `applications`
bucket-д хадгалагдаж, мөн хавсралт файлуудтай нь `HR_TO_EMAIL` (хоосон бол `CONTACT_TO_EMAIL`) хаяг руу илгээгдэнэ.
Аль нэг нь амжилттай болбол анкетыг хүлээн авсанд тооцно.

- **Ажлын байр нэмэх, засах**: Supabase → `jobs` хүснэгт. Анкетын "Албан тушаал" сонголт автоматаар шинэчлэгдэнэ.
- **Анкетын талбар нэмэх, хасах**: `lib/application.ts`. Маягт болон и-мэйл хоёулаа эндээс бүрдэнэ.
- **Заавал хавсаргах файл**: цээж зураг, диплом, мэргэжлийн үнэмлэх. `jobs.requires_rail_documents` = true ажлын
  байранд иргэний үнэмлэх, ажил байдлын тодорхойлолт мөн заавал. `requires_driver_license` = true бол жолооны
  үнэмлэхний ангилал заавал.
- **Файлын хэмжээ**: Vercel нэг хүсэлтэд 4.5 MB-аас ихийг хүлээж авдаггүй тул хавсралтын нийт хэмжээ 4 MB.
  Зургийг хөтөч дээр илгээхээс өмнө автоматаар шахна. PDF шахагдахгүй.

## Vercel дээр байршуулах

Vercel дээр project үүсгэхдээ **Root Directory**-г `web` гэж тохируулна.

## Англи хэл

Одоохондоо зөвхөн монгол хэлтэй. Англи хэл нэмэх алхмуудыг `lib/i18n.ts` дотор тайлбарласан.
