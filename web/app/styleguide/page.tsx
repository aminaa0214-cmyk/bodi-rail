import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardText, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Pill } from "@/components/ui/Pill";
import { Rule } from "@/components/ui/Rule";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stats } from "@/components/ui/Stats";
import { Tag } from "@/components/ui/Tag";
import { Checklist, DarkCard, RouteChips } from "@/components/sections/Lists";
import { FormFieldset, FormGrid, SelectField, TextareaField, TextField, UnitField } from "@/components/forms/Field";
import { cn } from "@/lib/cn";
import { LogoGuide } from "./LogoGuide";

export const metadata: Metadata = {
  title: "Загварын стандарт",
  description: "Бодь Рэйл вэбсайтын өнгө, үсгийн хэв маяг, товч, карт, маягтын стандарт.",
  // Дотоод лавлах хуудас: хайлтын системд гаргахгүй
  robots: { index: false, follow: false },
};

/*
 * Өнгөнүүд app/globals.css-ийн @theme-ээс ирнэ. Tailwind зөвхөн кодонд бүтнээрээ бичигдсэн
 * классыг үүсгэдэг тул `swatch`-ийг "bg-navy" гэх мэтээр бүтэн бичнэ. globals.css-д өнгө
 * нэмэх, өөрчлөх бол энд мөн hex-ийг шинэчилнэ үү.
 */
type Swatch = { token: string; swatch: string; hex: string; use: string; dark?: boolean };

const colorGroups: { title: string; colors: Swatch[] }[] = [
  {
    title: "Үндсэн",
    colors: [
      { token: "navy", swatch: "bg-navy", hex: "#031530", use: "Гарчиг, үндсэн текст, хар дэвсгэр", dark: true },
      { token: "navy-2", swatch: "bg-navy-2", hex: "#13294B", use: "Footer-ийн дэвсгэр", dark: true },
      { token: "brand", swatch: "bg-brand", hex: "#0F75BC", use: "Логоны өнгө", dark: true },
      { token: "white", swatch: "bg-white", hex: "#FFFFFF", use: "Хуудасны дэвсгэр, карт" },
    ],
  },
  {
    title: "Цэнхэр",
    colors: [
      { token: "blue", swatch: "bg-blue", hex: "#007BC9", use: "Үндсэн товч, тоон үзүүлэлт", dark: true },
      { token: "blue-dark", swatch: "bg-blue-dark", hex: "#0A73BA", use: "Холбоос, шошгоны текст, товчны hover", dark: true },
      { token: "sky", swatch: "bg-sky", hex: "#E6F2FA", use: "Шошго, pill-ийн дэвсгэр" },
    ],
  },
  {
    title: "Саарал, хүрээ",
    colors: [
      { token: "soft", swatch: "bg-soft", hex: "#F3F6FA", use: "Саарал хэсэг, тоон үзүүлэлтийн дэвсгэр" },
      { token: "ph", swatch: "bg-ph", hex: "#DCE3EC", use: "Зургийн орлуулга, картын хүрээ" },
      { token: "line", swatch: "bg-line", hex: "#C5D0DC", use: "Маягтын талбарын хүрээ" },
    ],
  },
  {
    title: "Текст",
    colors: [
      { token: "muted", swatch: "bg-muted", hex: "#4A5A70", use: "Туслах текст, тайлбар", dark: true },
      { token: "light", swatch: "bg-light", hex: "#C9D6E8", use: "Хар дэвсгэр дээрх текст" },
      { token: "accent-dark", swatch: "bg-accent-dark", hex: "#8FC8F0", use: "Хар дэвсгэр дээрх тод текст" },
    ],
  },
];

const typeScale = [
  {
    name: "H1 · Хуудасны гарчиг",
    className: "text-4xl leading-[1.1] font-extrabold uppercase md:text-5xl",
    spec: "36 / 48px · 800 · том үсэг",
    sample: "Тээвэр логистик",
  },
  {
    name: "H2 · Хэсгийн гарчиг",
    className: "text-[30px] font-extrabold md:text-[40px]",
    spec: "30 / 40px · 800",
    sample: "Хөдлөх бүрэлдэхүүний түрээс",
  },
  { name: "H3 · Картын гарчиг", className: "text-2xl font-bold", spec: "24px · 700", sample: "Evolution ТЭ33АС зүтгүүр" },
  { name: "H3 · Жижиг карт", className: "text-[19px] font-bold", spec: "19px · 700", sample: "Тавцант вагон" },
  {
    name: "Lead · Удиртгал",
    className: "max-w-[640px] text-[17px] text-muted",
    spec: "17px · 400 · muted",
    sample: "Төмөр замын ачаа тээвэр, хөдлөх бүрэлдэхүүний нийлүүлэлт, түрээс, засвар үйлчилгээ.",
  },
  {
    name: "Body · Үндсэн текст",
    className: "text-[15px] leading-[1.6]",
    spec: "15px · 400 · 1.6",
    sample: "“МТЗ” ТӨХК болон “МТЛ” ХХК-тай хамтран зүтгүүр түрээслүүлж, тээврийн үйл ажиллагаа эрхэлдэг.",
  },
  { name: "Small · Жижиг текст", className: "text-sm text-muted", spec: "14px · 400 · muted", sample: "ТТ–ГС чиглэл, 2023–2024" },
  {
    name: "Overline · Шошго",
    className: "text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark",
    spec: "13px · 700 · том үсэг · 0.08em",
    sample: "1. Маршрут",
  },
];

const weights = [
  { value: 400, className: "font-normal", label: "Regular" },
  { value: 500, className: "font-medium", label: "Medium" },
  { value: 600, className: "font-semibold", label: "Semibold" },
  { value: 700, className: "font-bold", label: "Bold" },
  { value: 800, className: "font-extrabold", label: "Extrabold" },
];

const radii = [
  { name: "rounded-md", value: "6px", use: "Жижиг товч", className: "rounded-md" },
  { name: "rounded-[10px]", value: "10px", use: "Товч, маягтын талбар", className: "rounded-[10px]" },
  { name: "rounded-2xl", value: "16px", use: "Тоон үзүүлэлт", className: "rounded-2xl" },
  { name: "rounded-card", value: "20px", use: "Карт, зураг", className: "rounded-card" },
  { name: "rounded-full", value: "9999px", use: "Pill, шошго, chip", className: "rounded-full" },
];

const layoutTokens = [
  { name: "Container", value: "1280px", note: "max-w-[1280px], хажуугийн зай 24px (px-6)" },
  { name: "Breakpoint sm", value: "600px", note: "sm: · утасны хэвтээ байрлал" },
  { name: "Breakpoint md", value: "900px", note: "md: · таблет, компьютер" },
  { name: "Section зай", value: "72 / 112px", note: "py-[72px] md:py-28 (Section-ийн анхдагч)" },
  { name: "Grid зай", value: "24px", note: "gap-6 (AutoGrid)" },
];

const toc = [
  { id: "colors", label: "Өнгө" },
  { id: "typography", label: "Үсгийн хэв маяг" },
  { id: "buttons", label: "Товч" },
  { id: "badges", label: "Шошго" },
  { id: "cards", label: "Карт" },
  { id: "forms", label: "Маягт" },
  { id: "data", label: "Үзүүлэлт, жагсаалт" },
  { id: "layout", label: "Хэмжээ, зай" },
  { id: "logo", label: "Лого" },
];

/** Компонентийн нэр, жишээ код */
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[13px] text-navy">{children}</code>;
}

/** Нэг хэсгийн гарчиг + агуулга */
function Block({
  id,
  pill,
  title,
  description,
  tone,
  children,
}: {
  id: string;
  pill: string;
  title: string;
  description?: React.ReactNode;
  tone?: "soft";
  children: React.ReactNode;
}) {
  return (
    <Section id={id} tone={tone} padding="py-16 md:py-20" className="scroll-mt-16">
      <Container>
        <SectionHead pill={pill} title={title} description={description} />
        {children}
      </Container>
    </Section>
  );
}

/** Жишээг тайлбартай нь харуулах хүрээ */
function Specimen({
  label,
  dark,
  className,
  children,
}: {
  label: React.ReactNode;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-card border border-ph">
      <div
        className={cn(
          "flex flex-1 flex-wrap items-center gap-4 p-7",
          dark ? "bg-navy text-white" : "bg-white",
          className,
        )}
      >
        {children}
      </div>
      <figcaption className="border-t border-ph bg-soft px-5 py-3 text-sm text-muted">{label}</figcaption>
    </figure>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <PageHero
        title="Загварын стандарт"
        breadcrumb={[{ label: "Загварын стандарт" }]}
        description="Бодь Рэйл вэбсайтын өнгө, үсгийн хэв маяг, товч, карт, маягтын нэгдсэн стандарт. Энд харагдах бүх жишээ сайтын бодит компонентуудаар бүтсэн."
      />

      <nav
        aria-label="Агуулга"
        className="sticky top-0 z-10 border-b border-ph bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      >
        <Container className="flex gap-1 overflow-x-auto py-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex min-h-10 flex-none items-center rounded-full px-4 text-sm font-semibold text-muted no-underline hover:bg-sky hover:text-blue-dark"
            >
              {item.label}
            </a>
          ))}
        </Container>
      </nav>

      {/* Өнгө */}
      <Block
        id="colors"
        pill="01"
        title="Өнгө"
        description={
          <>
            Вэбсайтын интерфейсийн өнгө (<Code>navy</Code>, <Code>blue</Code>, <Code>blue-dark</Code> нь bodigroup.mn
            вэбсайттай ижил). Брэндбүүкийн албан ёсны өнгийг <a href="#logo">Лого</a> хэсгээс харна уу. Бүх өнгө{" "}
            <Code>app/globals.css</Code>-ийн <Code>@theme</Code> хэсэгт тодорхойлогдсон, нэр бүрийг <Code>bg-</Code>,{" "}
            <Code>text-</Code>, <Code>border-</Code> угтвартай ашиглана.
          </>
        }
      >
        <div className="flex flex-col gap-12">
          {colorGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">{group.title}</h3>
              <AutoGrid min={220} className="gap-5">
                {group.colors.map((color) => (
                  <div key={color.token} className="flex flex-col overflow-hidden rounded-card border border-ph">
                    <div
                      className={cn(
                        "flex h-32 items-end p-4 font-mono text-sm font-semibold",
                        color.swatch,
                        color.dark ? "text-white" : "text-navy",
                      )}
                    >
                      {color.hex}
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      <div className="font-bold">{color.token}</div>
                      <div className="font-mono text-[13px] text-blue-dark">{color.swatch}</div>
                      <div className="pt-1 text-sm text-muted">{color.use}</div>
                    </div>
                  </div>
                ))}
              </AutoGrid>
            </div>
          ))}
        </div>
      </Block>

      {/* Үсгийн хэв маяг */}
      <Block
        id="typography"
        pill="02"
        title="Үсгийн хэв маяг"
        tone="soft"
        description={
          <>
            Фонт: <strong>Inter</strong>, Монгол кирилл (Ө, Ү) бүрэн дэмжинэ. <Code>app/layout.tsx</Code>-д 400–800
            жинтэй ачаалагдана.
          </>
        }
      >
        <div className="mb-12 flex flex-col gap-6 rounded-card bg-white p-7 md:p-10">
          <div className="text-[64px] leading-none font-extrabold md:text-[96px]">Аа Өө Үү</div>
          <div className="text-lg break-words text-muted">
            А Б В Г Д Е Ё Ж З И Й К Л М Н О Ө П Р С Т У Ү Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я
            <br />
            а б в г д е ё ж з и й к л м н о ө п р с т у ү ф х ц ч ш щ ъ ы ь э ю я
            <br />
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z · 0 1 2 3 4 5 6 7 8 9
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 border-t border-ph pt-6">
            {weights.map((weight) => (
              <div key={weight.value} className="flex flex-col gap-1">
                <span className={cn("text-[28px]", weight.className)}>Бодь Рэйл</span>
                <span className="text-sm text-muted">
                  {weight.value} · {weight.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col divide-y divide-ph overflow-hidden rounded-card bg-white">
          {typeScale.map((item) => (
            <div key={item.name} className="grid gap-3 p-6 md:grid-cols-[240px_1fr] md:gap-8 md:p-8">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-bold">{item.name}</div>
                <div className="text-sm text-muted">{item.spec}</div>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <div className={item.className}>{item.sample}</div>
                <div className="font-mono text-xs break-all text-blue-dark">{item.className}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Товч */}
      <Block
        id="buttons"
        pill="03"
        title="Товч"
        description={
          <>
            Хуудас шилжих бол <Code>ButtonLink</Code>, үйлдэл хийх бол <Code>Button</Code>. Хувилбарууд:{" "}
            <Code>primary</Code>, <Code>dark</Code>, <Code>white</Code>, <Code>outline-light</Code>.
          </>
        }
      >
        <AutoGrid min={380}>
          <Specimen label={<>Цагаан дэвсгэр дээр · <Code>primary</Code>, <Code>dark</Code></>}>
            <Button>Захиалга илгээх</Button>
            <Button variant="dark">Дэлгэрэнгүй</Button>
          </Specimen>
          <Specimen dark label={<>Хар дэвсгэр дээр · <Code>white</Code>, <Code>outline-light</Code></>}>
            <Button variant="white">Үнийн санал авах</Button>
            <Button variant="outline-light">Холбоо барих</Button>
          </Specimen>
          <Specimen label={<>Хэмжээ · <Code>size=&quot;md&quot;</Code> 48px, <Code>size=&quot;sm&quot;</Code> 44px</>}>
            <Button>Дунд</Button>
            <Button size="sm">Жижиг</Button>
          </Specimen>
          <Specimen label={<>Том үсэгтэй · <Code>caps</Code> (нүүр хуудасны баннер)</>}>
            <Button caps>Үйлчилгээ үзэх</Button>
          </Specimen>
          <Specimen label={<>Идэвхгүй · <Code>disabled</Code> (маягт илгээгдэж байх үед)</>}>
            <Button disabled>Илгээж байна…</Button>
          </Specimen>
          <Specimen label={<>Сумтай холбоос · <Code>LinkArrow</Code></>}>
            <LinkArrow href="#buttons">Дэлгэрэнгүй</LinkArrow>
            <ButtonLink href="#buttons" variant="primary">
              Холбоос товч
            </ButtonLink>
          </Specimen>
        </AutoGrid>
      </Block>

      {/* Шошго */}
      <Block id="badges" pill="04" title="Шошго" tone="soft">
        <AutoGrid min={320}>
          <Specimen label={<><Code>Pill</Code> · хэсгийн дугаар, ангилал</>}>
            <Pill>01</Pill>
            <Pill>Захиалга</Pill>
          </Specimen>
          <Specimen dark label={<><Code>Pill outline</Code> · хар дэвсгэр дээр</>}>
            <Pill outline>Нэмэлт үйлчилгээ</Pill>
          </Specimen>
          <Specimen label={<><Code>Tag</Code> · картын төрөл</>}>
            <Tag>Зүтгүүр</Tag>
            <Tag>Вагон</Tag>
            <Tag>Чингэлэг өргөгч</Tag>
          </Specimen>
          <Specimen dark label={<><Code>Chip</Code> · хуудасны толгойн холбоос</>}>
            <Chip href="#badges" primary>
              Захиалга өгөх
            </Chip>
            <Chip href="#badges">Түрээс</Chip>
          </Specimen>
          <Specimen label={<><Code>RouteChips</Code> · тээврийн чиглэл</>}>
            <RouteChips routes={["Тавантолгой – Гашуунсухайт", "Тавантолгой – Зүүнбаян"]} />
          </Specimen>
          <Specimen dark label={<><Code>Rule</Code> · гарчгийн доорх зураас</>} className="flex-col items-start">
            <div className="text-2xl font-extrabold uppercase">Гарчиг</div>
            <Rule />
          </Specimen>
        </AutoGrid>
      </Block>

      {/* Карт */}
      <Block
        id="cards"
        pill="05"
        title="Карт"
        description={
          <>
            <Code>Card</Code>-ийн хувилбарууд: <Code>plain</Code>, <Code>bordered</Code>, <Code>dashed</Code>. Жижиг
            картанд <Code>compact</Code>. Булан 20px (<Code>rounded-card</Code>).
          </>
        }
      >
        <AutoGrid min={260}>
          <Card variant="bordered" compact media={<ImagePlaceholder label="ТЭ33АС зүтгүүр" className="h-[180px]" />}>
            <Tag>Зүтгүүр</Tag>
            <CardTitle compact>Evolution ТЭ33АС</CardTitle>
            <CardText>
              Гол замын зүтгүүр
              <br />
              variant=&quot;bordered&quot; compact
            </CardText>
          </Card>
          <Card variant="plain" className="shadow-[0_8px_30px_rgba(3,21,48,.08)]">
            <Tag>Plain</Tag>
            <CardTitle>Зөвлөх үйлчилгээ</CardTitle>
            <CardText>Хүрээгүй карт. Саарал (soft) дэвсгэртэй хэсэгт хэрэглэнэ.</CardText>
            <LinkArrow href="#cards">Дэлгэрэнгүй</LinkArrow>
          </Card>
          <Card
            variant="dashed"
            compact
            media={<div className="flex h-[180px] items-center justify-center font-semibold text-blue-dark">＋ Хүсэлтээр</div>}
          >
            <Tag>Бусад</Tag>
            <CardTitle compact>Бусад хөдлөх бүрэлдэхүүн</CardTitle>
            <CardText>variant=&quot;dashed&quot;: нэмэлт, хүсэлтээр гэсэн утгатай.</CardText>
          </Card>
        </AutoGrid>
        <div className="mt-6 rounded-card bg-navy p-6 md:p-8">
          <AutoGrid min={380}>
            <DarkCard title="DarkCard">
              <p>Хар дэвсгэртэй хэсэг дэх карт. Хагас тунгалаг цагаан хүрээ, дэвсгэртэй.</p>
            </DarkCard>
            <DarkCard title="Тээвэр зууч, гаалийн зууч">
              <p>Тээвэр зуучлалын тусгай зөвшөөрөлтэйгөөр ачааг гаалийн бүрдүүлэлттэй нь зуучилна.</p>
            </DarkCard>
          </AutoGrid>
        </div>
      </Block>

      {/* Маягт */}
      <Block
        id="forms"
        pill="06"
        title="Маягт"
        tone="soft"
        description={
          <>
            Талбарууд <Code>components/forms/Field.tsx</Code>-д. Өндөр 48px, булан 10px, хүрээ <Code>line</Code>,
            идэвхтэй үед <Code>blue</Code> outline.
          </>
        }
      >
        <div className="flex flex-col gap-8 rounded-card bg-white p-7 md:p-10">
          <FormFieldset legend="FormFieldset · бүлгийн гарчиг">
            <FormGrid>
              <TextField label="TextField" name="sg_text" placeholder="Жишээ: Тавантолгой" />
              <TextField label="TextField · type=email" name="sg_email" type="email" placeholder="name@company.mn" />
              <SelectField label="SelectField" name="sg_select" options={["Нүүрс", "Хүдэр, баяжмал", "Чингэлэгтэй ачаа"]} />
              <UnitField label="UnitField · нэгжтэй" name="sg_unit" unit="тонн" placeholder="0" min={0} />
              <TextField label="TextField · type=date" name="sg_date" type="date" />
              <TextField label="Идэвхгүй талбар" name="sg_disabled" placeholder="disabled" disabled />
              <TextareaField label="TextareaField · full" name="sg_textarea" rows={3} full />
            </FormGrid>
          </FormFieldset>
          <Button className="self-start">Илгээх</Button>
        </div>
      </Block>

      {/* Тоон үзүүлэлт, жагсаалт */}
      <Block id="data" pill="07" title="Үзүүлэлт, жагсаалт">
        <AutoGrid min={380}>
          <Specimen label={<><Code>Stats</Code> · size=&quot;lg&quot; (анхдагч)</>} className="block">
            <Stats
              items={[
                { value: "4", label: "ТЭ33АС зүтгүүр" },
                { value: "200", label: "Тавцант вагон" },
              ]}
            />
          </Specimen>
          <Specimen label={<><Code>Stats</Code> · size=&quot;md&quot;, small</>} className="block">
            <Stats
              size="md"
              items={[
                { value: "3 сая тн", label: "ТТ–ГС чиглэл" },
                { value: "ТТ → ГС", label: "Урт утга", small: true },
              ]}
            />
          </Specimen>
          <Specimen label={<><Code>Checklist</Code> · давуу тал, үйлчилгээний жагсаалт</>} className="block">
            <Checklist items={["Тээвэр логистикийн тооцоолол", "Хөдлөх бүрэлдэхүүний сонголт", "Сэлбэг нийлүүлэлт"]} />
          </Specimen>
          <Specimen label={<><Code>ImagePlaceholder</Code> · зураг орох хүртэл</>} className="block p-0">
            <ImagePlaceholder label="ачааны галт тэрэг" className="h-[180px]" />
          </Specimen>
        </AutoGrid>
      </Block>

      {/* Хэмжээ, зай */}
      <Block id="layout" pill="08" title="Хэмжээ, зай" tone="soft">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-card bg-white p-7">
            <h3 className="text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">Булангийн радиус</h3>
            {radii.map((r) => (
              <div key={r.name} className="flex items-center gap-4">
                <div className={cn("size-14 flex-none border-2 border-blue bg-sky", r.className)} />
                <div className="flex flex-col">
                  <span className="font-mono text-[13px] font-semibold">{r.name}</span>
                  <span className="text-sm text-muted">
                    {r.value} · {r.use}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-card bg-white p-7">
            <h3 className="text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">Layout</h3>
            {layoutTokens.map((t) => (
              <div key={t.name} className="flex flex-col gap-0.5 border-b border-ph pb-3 last:border-0">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">{t.name}</span>
                  <span className="font-mono text-sm font-semibold text-blue">{t.value}</span>
                </div>
                <span className="text-sm text-muted">{t.note}</span>
              </div>
            ))}
          </div>
        </div>
      </Block>

      {/* Лого */}
      <Block
        id="logo"
        pill="09"
        title="Лого"
        description="Бодь Группийн «Брэнд хөтөч»-ийн 2-р бүлэг «Логоны байгуулалт, стандарт»-ын дагуу: бүтэц, харьцаа, хэмжээ, өнгө, дэвсгэр, хориглох зүйлс."
      >
        <LogoGuide />
      </Block>
    </>
  );
}
