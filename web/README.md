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
| `/medee/<slug>` | `app/medee/[slug]/page.tsx`, агуулга нь `content/news.ts` |
| `/hunii-nuuts` | `app/hunii-nuuts/page.tsx`, ажлын байр, хангамж нь `content/jobs.ts`, анкетын талбарууд нь `lib/application.ts` |

## Хавтасны бүтэц

```
app/                 хуудсууд, layout (header + footer), globals.css (өнгө, фонт)
app/actions/         Server Action: маягтыг и-мэйлээр илгээх
components/layout/   SiteHeader, SiteFooter, Hero, PageHero, Brand
components/ui/       Button, Pill, Tag, Chip, Card, Section, SectionHead, Stats ...
components/sections/ Licenses, FleetCarousel, Timeline, PartnerLogos, NewsCard, Split ...
components/forms/    InquiryForm, Field, FormSection
content/             давтагддаг өгөгдөл: холбоо барих, цэс, мэдээ, зөвшөөрөл, хамтрагч, слайд
lib/                 туслах функцууд, хэлний тохиргоо, маягтын тохиргоо
public/images/       зургууд
```

- **Өнгө өөрчлөх**: `app/globals.css` доторх `@theme`.
- **Мэдээ нэмэх**: `content/news.ts`-ийн эхэнд нэг объект нэмээд зургийг `public/images/news/<slug>/` хавтсанд хийнэ.
- **Слайд нэмэх**: `content/fleet.ts`.
- **Утас, хаяг өөрчлөх**: `content/site.ts`. Бүх хуудсанд нэг дор өөрчлөгдөнө.

## Маягт → и-мэйл

Гурван маягт (үнийн санал, тээврийн захиалга, үйлчилгээний хүсэлт) нь `app/actions/send-inquiry.ts` Server Action-аар
[Resend](https://resend.com) ашиглан `info@bodirail.mn` руу илгээгдэнэ.

1. resend.com дээр бүртгүүлж API key авна.
2. Resend → Domains хэсэгт `bodirail.mn`-ийг нэмж, өгсөн DNS бичлэгүүдийг домэйндээ оруулж баталгаажуулна.
3. Vercel → Project → Settings → Environment Variables хэсэгт `.env.example`-д байгаа хувьсагчдыг нэмнэ.
   Компьютер дээрээ туршихдаа `.env.example`-ийг `.env.local` нэрээр хуулж бөглөнө.

`RESEND_API_KEY` тохируулаагүй үед `npm run dev` горимд и-мэйл илгээхгүй, агуулгыг нь терминалд хэвлэнэ.

## Онлайн анкет → и-мэйл

Хүний нөөц хуудасны анкет `app/actions/send-application.ts`-аар хавсралт файлуудтай нь
`HR_TO_EMAIL` (хоосон бол `CONTACT_TO_EMAIL`) хаяг руу илгээгдэнэ.

- **Ажлын байр нэмэх, засах**: `content/jobs.ts`. Анкетын "Албан тушаал" сонголт автоматаар шинэчлэгдэнэ.
- **Анкетын талбар нэмэх, хасах**: `lib/application.ts`. Маягт болон и-мэйл хоёулаа эндээс бүрдэнэ.
- **Заавал хавсаргах файл**: цээж зураг, диплом, мэргэжлийн үнэмлэх. Ачаа вагон хүлээлцэгч, тооцооны операторт
  иргэний үнэмлэх, ажил байдлын тодорхойлолт мөн заавал. Захиргааны жолоочид жолооны үнэмлэхний ангилал заавал.
- **Файлын хэмжээ**: Vercel нэг хүсэлтэд 4.5 MB-аас ихийг хүлээж авдаггүй тул хавсралтын нийт хэмжээ 4 MB.
  Зургийг хөтөч дээр илгээхээс өмнө автоматаар шахна. PDF шахагдахгүй.

## Vercel дээр байршуулах

Vercel дээр project үүсгэхдээ **Root Directory**-г `web` гэж тохируулна.

## Англи хэл

Одоохондоо зөвхөн монгол хэлтэй. Англи хэл нэмэх алхмуудыг `lib/i18n.ts` дотор тайлбарласан.
