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

## Vercel дээр байршуулах

Vercel дээр project үүсгэхдээ **Root Directory**-г `web` гэж тохируулна.

## Англи хэл

Одоохондоо зөвхөн монгол хэлтэй. Англи хэл нэмэх алхмуудыг `lib/i18n.ts` дотор тайлбарласан.
