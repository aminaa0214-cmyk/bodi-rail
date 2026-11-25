import { useId } from "react";
import { Brand } from "@/components/layout/Brand";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/*
 * Логоны стандарт: Бодь Группийн «Брэнд хөтөч», 2-р бүлэг «Логоны байгуулалт, стандарт» (х. 9–41).
 * Брэндбүүкийн тоо, өнгийг энд шууд бичсэн. Брэндбүүк шинэчлэгдвэл энэ файлыг шинэчилнэ.
 */

export const BRAND_BLUE = "#0072BC";

/* ---------- Тэмдэг ба лого ---------- */

const CORNERS = [
  [0, 0],
  [432, 0],
  [0, 432],
  [432, 432],
] as const;

/**
 * Таван нүдэн тэмдэг (432×432 нэгж). public/images/logo.svg-тэй ижил байгуулалт:
 * дотор тойрог r170, булангийн тойрог r195 ба r258 (брэндбүүкийн 100% : 130%).
 * Өнгө нь currentColor. Хуудсанд олон удаа гарах тул id бүрийг useId-ээр үүсгэнэ.
 */
function SymbolShape() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <>
      <defs>
        <clipPath id={`${id}-in`}>
          <circle cx="216" cy="216" r="170" />
        </clipPath>
        <mask id={`${id}-m`}>
          <rect width="432" height="432" fill="#fff" />
          <circle cx="216" cy="216" r="170" fill="#000" />
          <g clipPath={`url(#${id}-in)`}>
            {CORNERS.map(([x, y]) => (
              <circle key={`o${x}-${y}`} cx={x} cy={y} r="258" fill="#fff" />
            ))}
            {CORNERS.map(([x, y]) => (
              <circle key={`i${x}-${y}`} cx={x} cy={y} r="195" fill="#000" />
            ))}
          </g>
        </mask>
      </defs>
      <circle cx="216" cy="216" r="216" fill="currentColor" mask={`url(#${id}-m)`} />
    </>
  );
}

/** Зөвхөн тэмдэг */
export function LogoSymbol({ size = 48, color = BRAND_BLUE, className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 432 432" width={size} height={size} className={cn("block flex-none", className)} style={{ color }} aria-hidden="true">
      <SymbolShape />
    </svg>
  );
}

/*
 * Лого (тэмдэг + бичиглэл) 100 нэгжийн тэмдэгтэй координатад:
 *   x (нэгж)            = тэмдгийн диаметрийн ¼ = 25
 *   тэмдэг ба бичгийн зай = x
 *   том үсгийн өндөр      ≈ 1.6x = 40 (брэндбүүкийн х. 23-аас хэмжив)
 * Бичгийн өргөнийг textLength-ээр тогтоосон тул фонт ачаалагдаагүй үед ч харьцаа алдагдахгүй.
 */
const UNIT = 25;
const CAP = 40;
const FONT_SIZE = 55; // Inter-ийн том үсгийн өндөр ≈ 0.727em → 40 нэгж
const TEXT_W = 338;

type LockupProps = {
  /** Тэмдгийн диаметр, px */
  size?: number;
  color?: string;
  textColor?: string;
  // Доорх тохиргоонууд зөвхөн «хориглох зүйлс»-ийн жишээнд
  symbolScale?: number;
  gap?: number;
  arrangement?: "row" | "reverse" | "stacked";
  stretch?: number;
  text?: string;
  textStyle?: React.CSSProperties;
  textOutline?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export function Lockup({
  size = 64,
  color = BRAND_BLUE,
  textColor,
  symbolScale = 1,
  gap = 1,
  arrangement = "row",
  stretch = 1,
  text = site.brand,
  textStyle,
  textOutline,
  style,
  className,
}: LockupProps) {
  const s = 100 * symbolScale;
  const g = gap * UNIT;
  let w: number, h: number, sx: number, sy: number, tx: number, ty: number;
  let anchor: "start" | "middle" = "start";

  if (arrangement === "stacked") {
    w = Math.max(TEXT_W, s);
    h = s + g + CAP;
    sx = (w - s) / 2;
    sy = 0;
    tx = w / 2;
    ty = h;
    anchor = "middle";
  } else {
    w = s + g + TEXT_W;
    h = Math.max(s, 100);
    sy = (h - s) / 2;
    ty = h / 2 + CAP / 2;
    [sx, tx] = arrangement === "reverse" ? [TEXT_W + g, 0] : [0, s + g];
  }

  const k = size / 100;
  const fill = textColor ?? color;
  // Бичгийн өргөнийг зөвхөн жинхэнэ бичиглэлд тогтооно. Өөр бичвэрт хүчээр тэлэхэд үсэг хэт сарнина.
  const fit = text === site.brand;

  return (
    <svg
      role="img"
      aria-label={text}
      viewBox={`0 0 ${w} ${h}`}
      width={w * k * stretch}
      height={h * k}
      preserveAspectRatio={stretch === 1 ? undefined : "none"}
      className={cn("block h-auto max-w-full flex-none", className)}
      style={style}
    >
      <g transform={`translate(${sx} ${sy}) scale(${s / 432})`} style={{ color }}>
        <SymbolShape />
      </g>
      <text
        x={tx}
        y={ty}
        textAnchor={anchor}
        fontSize={FONT_SIZE}
        fontWeight={800}
        textLength={fit ? TEXT_W : undefined}
        lengthAdjust={fit ? "spacing" : undefined}
        fill={textOutline ? "none" : fill}
        stroke={textOutline ? fill : undefined}
        strokeWidth={textOutline ? 1.5 : undefined}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", ...textStyle }}
      >
        {text}
      </text>
    </svg>
  );
}

/* ---------- Өгөгдөл ---------- */

type BrandColor = {
  name: string;
  role: string;
  hex: string;
  pantone: string;
  cmyk: string;
  rgb: string;
  light?: boolean;
};

const brandColors: BrandColor[] = [
  { name: "Blue", role: "Үндсэн өнгө", hex: "#0072BC", pantone: "7461 C", cmyk: "100 · 50 · 0 · 0", rgb: "0 · 114 · 188" },
  { name: "Orange", role: "Хоёрдогч өнгө", hex: "#F58220", pantone: "1375 C", cmyk: "0 · 60 · 100 · 0", rgb: "245 · 130 · 32" },
  { name: "Dark Blue", role: "Туслах өнгө", hex: "#181B66", pantone: "Reflex Blue C", cmyk: "100 · 96 · 0 · 40", rgb: "24 · 27 · 102" },
  { name: "Light Gray", role: "Туслах өнгө", hex: "#AFAFAF", pantone: "428 C", cmyk: "0 · 0 · 0 · 40", rgb: "167 · 169 · 172", light: true },
  { name: "Brand Gray", role: "Туслах өнгө", hex: "#848484", pantone: "877 C", cmyk: "0 · 0 · 0 · 60", rgb: "128 · 130 · 132" },
];

/** Өнгөний уусалт (брэндбүүк х. 16–17), бараанаас цайвар руу */
const tints = [
  { name: "Blue", base: "#0072BC", steps: ["#192732", "#1A4059", "#005884", "#0072BC", "#3A88C8", "#7DA7D9", "#BACCEA"] },
  { name: "Orange", base: "#F58220", steps: ["#3A2A1E", "#6A4427", "#A66129", "#F58220", "#F89E53", "#FCBC86", "#FEDCBD"] },
];

/** Логоны дэвсгэр (брэндбүүк х. 19, 34–35) */
const backgrounds = [
  { label: "Цэнхэр дэвсгэр", note: "Цагаан лого", bg: "#0072BC", color: "#FFFFFF" },
  { label: "Цагаан дэвсгэр", note: "Үндсэн өнгөтэй лого", bg: "#FFFFFF", color: BRAND_BLUE, bordered: true },
  { label: "Саарал дэвсгэр", note: "Цагаан лого", bg: "#AFAFAF", color: "#FFFFFF" },
  { label: "Хар дэвсгэр", note: "Цагаан лого", bg: "#231F20", color: "#FFFFFF" },
  { label: "Нэг өнгийн хэвлэл", note: "Хар лого, цайвар дэвсгэр", bg: "#FFFFFF", color: "#000000", bordered: true },
];

type Dont = { label: string; props: LockupProps };

/** Логонд хориглох зүйлс (брэндбүүк х. 24–25) */
const donts: { title: string; items: Dont[] }[] = [
  {
    title: "1. Тэмдэг, бичгийн хэмжээ, байрлалыг өөрчлөх",
    items: [
      { label: "Тэмдгийг жижигрүүлэх", props: { symbolScale: 0.7 } },
      { label: "Тэмдгийг томруулах", props: { symbolScale: 1.35 } },
      { label: "Зайг багасгах", props: { gap: 0.2 } },
      { label: "Зайг ихэсгэх", props: { gap: 2.6 } },
      { label: "Тэмдгийг баруун талд", props: { arrangement: "reverse" } },
      { label: "Дээш доош байрлуулах", props: { arrangement: "stacked" } },
    ],
  },
  {
    title: "2. Бичгийн фонт, хэлбэрийг өөрчлөх",
    items: [
      { label: "Өөр фонт", props: { textStyle: { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700 } } },
      { label: "Нимгэн жин", props: { textStyle: { fontWeight: 300 } } },
      { label: "Жижиг үсэг холих", props: { text: "Bodi Rail" } },
      { label: "Налуу бичиг", props: { textStyle: { fontStyle: "italic" } } },
    ],
  },
  {
    title: "3. Эффект нэмэх, хэлбэр гажуудуулах",
    items: [
      { label: "Сүүдэр", props: { style: { filter: "drop-shadow(4px 4px 3px rgba(0,0,0,.45))" } } },
      { label: "Хүрээ (outline)", props: { textOutline: true } },
      { label: "Сунгах", props: { stretch: 1.35 } },
      { label: "Хавтгайруулах", props: { stretch: 0.75 } },
    ],
  },
  {
    title: "4. Логоны өнгийг солих",
    items: [
      { label: "Өөр цэнхэр", props: { color: "#2E3192" } },
      { label: "Цайвар өнгө", props: { color: "#8FD3F4" } },
      { label: "Бичиг хар", props: { textColor: "#000000" } },
      { label: "Бичиг саарал", props: { textColor: "#848484" } },
    ],
  },
];

/* ---------- Туслах компонентууд ---------- */

function SubHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex max-w-[720px] flex-col gap-2">
      <h3 className="text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">{title}</h3>
      {children && <p className="text-[15px] leading-[1.6] text-muted">{children}</p>}
    </div>
  );
}

function Panel({ caption, className, children }: { caption: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-card border border-ph">
      <div className={cn("flex flex-1 items-center justify-center bg-white p-7", className)}>{children}</div>
      <figcaption className="border-t border-ph bg-soft px-5 py-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

/** Тэмдгийн байгуулалт: 100% ба 130% тойргууд */
function ConstructionDiagram() {
  const guide = { fill: "none", stroke: "#F58220", strokeWidth: 2, strokeDasharray: "6 5" } as const;
  return (
    <svg viewBox="-60 -60 552 552" className="h-auto w-full max-w-[320px]" aria-hidden="true">
      <g style={{ color: "#BACCEA" }}>
        <SymbolShape />
      </g>
      <circle cx="216" cy="216" r="216" fill="none" stroke="#0072BC" strokeWidth="2" />
      <circle cx="216" cy="216" r="170" fill="none" stroke="#0072BC" strokeWidth="2" strokeDasharray="6 5" />
      {CORNERS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="195" {...guide} />
          <circle cx={x} cy={y} r="258" {...guide} strokeOpacity=".5" />
        </g>
      ))}
    </svg>
  );
}

function RatioDiagram() {
  return (
    <svg viewBox="0 0 300 335" className="h-auto w-full max-w-[260px]" aria-hidden="true">
      <circle cx="150" cy="150" r="130" fill="#E6F2FA" stroke="#0072BC" strokeWidth="2" />
      <circle cx="150" cy="150" r="100" fill="#BACCEA" stroke="#0072BC" strokeWidth="2" />
      {/* 100%: жижиг тойргийн диаметр */}
      <line x1="50" y1="150" x2="250" y2="150" stroke="#031530" strokeWidth="1.5" />
      <text x="150" y="140" textAnchor="middle" fontSize="18" fontWeight="700" fill="#031530">
        100%
      </text>
      {/* 130%: том тойргийн диаметр, доор нь хэмжээсийн шугамаар */}
      <g stroke="#F58220" strokeWidth="1.5">
        <line x1="20" y1="150" x2="20" y2="306" strokeDasharray="4 4" />
        <line x1="280" y1="150" x2="280" y2="306" strokeDasharray="4 4" />
        <line x1="20" y1="300" x2="280" y2="300" />
      </g>
      <text x="150" y="326" textAnchor="middle" fontSize="18" fontWeight="700" fill="#F58220">
        130%
      </text>
    </svg>
  );
}

/** Лого, түүний сул зай ба хэмжээсүүд (x = тэмдгийн диаметрийн ¼) */
function ClearSpaceDiagram() {
  // Сул зайн хүрээ: (0,30)–(513,180). Лого: (25,55)–(488,155).
  const x0 = 25;
  const y0 = 55;
  const capTop = y0 + 50 - CAP / 2;
  const capBottom = y0 + 50 + CAP / 2;
  const dash = { stroke: "#0072BC", strokeWidth: 1, strokeDasharray: "4 4", fill: "none" } as const;
  const label = { fontSize: 13, fontWeight: 700, fill: "#F58220", textAnchor: "middle" } as const;
  const corners = [
    [0, 30],
    [488, 30],
    [0, 155],
    [488, 155],
  ];

  return (
    <svg viewBox="0 0 570 190" className="h-auto w-full" role="img" aria-label="Логоны сул зай ба хэмжээс">
      {corners.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={UNIT} height={UNIT} fill="#DCE3EC" />
      ))}
      <rect x="0" y="30" width="513" height="150" {...dash} />
      <rect x={x0} y={y0} width="463" height="100" {...dash} strokeDasharray="2 3" />
      <line x1={x0 + 125} y1={capTop} x2="530" y2={capTop} {...dash} stroke="#F58220" />
      <line x1={x0 + 125} y1={capBottom} x2="530" y2={capBottom} {...dash} stroke="#F58220" />

      <g transform={`translate(${x0} ${y0}) scale(${100 / 432})`} style={{ color: BRAND_BLUE }}>
        <SymbolShape />
      </g>
      <text
        x={x0 + 125}
        y={capBottom}
        fontSize={FONT_SIZE}
        fontWeight={800}
        textLength={TEXT_W}
        lengthAdjust="spacing"
        fill={BRAND_BLUE}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {site.brand}
      </text>

      {/* Дээд талын хэмжээс: x · 4x · x */}
      {[
        [0, 25, "x"],
        [25, 125, "4x"],
        [125, 150, "x"],
      ].map(([a, b, t]) => (
        <g key={`${a}`}>
          <line x1={a} y1="14" x2={b} y2="14" stroke="#F58220" strokeWidth="1.5" />
          <line x1={a} y1="9" x2={a} y2="19" stroke="#F58220" strokeWidth="1.5" />
          <line x1={b} y1="9" x2={b} y2="19" stroke="#F58220" strokeWidth="1.5" />
          <text x={(Number(a) + Number(b)) / 2} y="9" {...label}>
            {t}
          </text>
        </g>
      ))}
      {/* Баруун талын хэмжээс: том үсгийн өндөр */}
      <line x1="540" y1={capTop} x2="540" y2={capBottom} stroke="#F58220" strokeWidth="1.5" />
      <text x="556" y={(capTop + capBottom) / 2 + 5} {...label}>
        1.6x
      </text>
    </svg>
  );
}

function Ruler({ width, label }: { width: number; label: string }) {
  return (
    <div className="flex flex-col gap-1" style={{ width }}>
      <div className="h-2 border-x border-b border-navy" />
      <span className="text-xs font-semibold text-muted">{label}</span>
    </div>
  );
}

function DontCard({ label, props }: Dont) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-2xl border border-ph bg-white">
      <div className="relative flex h-28 items-center justify-center overflow-hidden px-4">
        <Lockup size={36} {...props} />
        <svg className="pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <line x1="4" y1="8" x2="96" y2="92" stroke="#E5322D" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <figcaption className="flex items-center gap-2 border-t border-ph bg-soft px-4 py-2.5 text-[13px] font-semibold">
        <span aria-hidden="true" className="text-[#E5322D]">
          ✕
        </span>
        {label}
      </figcaption>
    </figure>
  );
}

/* ---------- Хэсэг ---------- */

export function LogoGuide() {
  return (
    <div className="flex flex-col gap-16">
      {/* Үндсэн лого */}
      <div>
        <SubHead title="Үндсэн лого">
          Таван нүдэн билэг тэмдэг ба бичиглэл. Тэмдэг үргэлж бичгийн зүүн талд, бүгд үндсэн цэнхэр (Blue #0072BC) өнгөтэй.
        </SubHead>
        <div className="flex min-h-[260px] items-center justify-center rounded-card border border-ph bg-white p-10">
          <Lockup size={110} />
        </div>
      </div>

      {/* Байгуулалт */}
      <div>
        <SubHead title="Билэг тэмдгийн байгуулалт">
          Эхлээд 100% диаметртэй жижиг тойрог, дараа нь 130% диаметртэй том тойрог байгуулна. Хоёр тойргийн хоорондох
          цагирагийг 4 буланд байрлуулж, төвд 5 дахийг нь тавина. Төв тойргоор хязгаарлагдсан хэсэг нь тэмдэг болно.
        </SubHead>
        <AutoGrid min={320}>
          <Panel caption="Жижиг тойрог 100%, том тойрог 130%">
            <RatioDiagram />
          </Panel>
          <Panel caption="Булангийн тойргууд (улбар шар) ба төв тойрог (цэнхэр)">
            <ConstructionDiagram />
          </Panel>
        </AutoGrid>
      </div>

      {/* Бичиглэл */}
      <div>
        <SubHead title="Бичиглэлийн хэлбэр">
          Албан ёсны фонт: <strong>Futuris</strong>, Bold, бүгд том үсгээр (UPPERCASE). Хэвлэл, албан бичигт заавал
          SVG/PNG лого файлыг ашиглана. Вэб дээрх энэ хуудасны жишээнүүдэд Inter Extrabold-оор орлуулсан.
        </SubHead>
      </div>

      {/* Сул зай */}
      <div>
        <SubHead title="Сул орон зай ба харьцаа">
          x = тэмдгийн диаметрийн ¼. Тэмдэг ба бичгийн хоорондох зай x. Лого бусад зураг, текст, графикаас 4 талдаа дор
          хаяж x зайтай байна (саарал дөрвөлжин).
        </SubHead>
        <div className="rounded-card border border-ph bg-white p-6 md:p-10">
          <ClearSpaceDiagram />
        </div>
      </div>

      {/* Хамгийн бага хэмжээ */}
      <div>
        <SubHead title="Хамгийн бага хэмжээ">
          Тэмдэг дангаараа 1 см-ээс, бүтэн лого 4 см-ээс багагүй. Дэлгэц дээр 1 см ≈ 38px, 4 см ≈ 151px.
        </SubHead>
        <AutoGrid min={320}>
          <Panel caption="Тэмдэг ≥ 1 см (38px)" className="min-h-40">
            <div className="flex flex-col items-start gap-2">
              <LogoSymbol size={38} />
              <Ruler width={38} label="1 см" />
            </div>
          </Panel>
          <Panel caption="Бүтэн лого ≥ 4 см (151px)" className="min-h-40">
            <div className="flex flex-col items-start gap-2">
              <Lockup size={151 / 4.63} />
              <Ruler width={151} label="4 см" />
            </div>
          </Panel>
        </AutoGrid>
      </div>

      {/* Брэнд өнгө */}
      <div>
        <SubHead title="Брэндийн өнгө">
          Хэвлэлд Pantone эсвэл CMYK, дэлгэцэнд RGB эсвэл HEX кодыг ашиглана. Үндсэн өнгө нь лого болон брэндийн гол
          элементүүдэд, хоёрдогч ба туслах өнгө нь онцлох, дэмжих зорилгоор.
        </SubHead>
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <ColorCard color={brandColors[0]} large />
          <ColorCard color={brandColors[1]} large />
        </div>
        <AutoGrid min={220} className="mt-5 gap-5">
          {brandColors.slice(2).map((c) => (
            <ColorCard key={c.name} color={c} />
          ))}
        </AutoGrid>
        <div className="mt-8 flex flex-col gap-4">
          {tints.map((t) => (
            <div key={t.name} className="flex flex-col gap-2">
              <span className="text-sm font-bold">{t.name} · өнгөний уусалт</span>
              <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-ph">
                {t.steps.map((hex, i) => (
                  <div
                    key={hex}
                    className={cn(
                      "flex h-16 items-end p-2 font-mono text-[11px] font-semibold",
                      hex === t.base && "ring-2 ring-navy ring-inset",
                    )}
                    style={{ backgroundColor: hex, color: i < 4 ? "#fff" : "#031530" }}
                  >
                    {hex}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Дэвсгэр */}
      <div>
        <SubHead title="Дэвсгэртэй ашиглах">
          Цагаан, цайвар дэвсгэр дээр үндсэн цэнхэр лого. Цэнхэр, саарал, хар болон бараан дэвсгэр дээр цагаан лого.
        </SubHead>
        <AutoGrid min={320} className="gap-5">
          {backgrounds.map((b) => (
            <figure key={b.label} className="flex flex-col overflow-hidden rounded-card border border-ph">
              <div className="flex h-40 items-center justify-center px-6" style={{ backgroundColor: b.bg }}>
                <Lockup size={44} color={b.color} />
              </div>
              <figcaption className="flex justify-between gap-3 border-t border-ph bg-soft px-5 py-3 text-sm">
                <span className="font-semibold">{b.label}</span>
                <span className="text-muted">{b.note}</span>
              </figcaption>
            </figure>
          ))}
        </AutoGrid>
      </div>

      {/* Хориглох зүйлс */}
      <div>
        <SubHead title="Логонд хориглох зүйлс">
          Логоны хэлбэр, харьцаа, өнгийг ямар ч тохиолдолд өөрчлөхгүй. Доорх жишээнүүд бүгд буруу хэрэглээ.
        </SubHead>
        <div className="flex flex-col gap-8">
          {donts.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <span className="text-sm font-bold">{group.title}</span>
              <AutoGrid min={220} className="gap-4">
                {group.items.map((d) => (
                  <DontCard key={d.label} {...d} />
                ))}
              </AutoGrid>
            </div>
          ))}
        </div>
      </div>

      {/* Сайт дээрх хэрэглээ */}
      <div>
        <SubHead title="Вэбсайт дээрх хэрэглээ">
          Сайтын толгой, хөл хэсэгт <code className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[13px]">Brand</code>{" "}
          компонент ашиглагдана. Тэмдэг 40px (≥ 1 см), тэмдэг ба бичгийн зай 10px = x.
        </SubHead>
        <AutoGrid min={320}>
          <Panel caption="<Brand /> · цагаан дэвсгэр" className="min-h-36">
            <Brand />
          </Panel>
          <Panel caption="<Brand light /> · хар дэвсгэр" className="min-h-36 bg-navy">
            <Brand light />
          </Panel>
        </AutoGrid>
      </div>
    </div>
  );
}

function ColorCard({ color, large }: { color: BrandColor; large?: boolean }) {
  const rows = [
    ["Pantone", color.pantone],
    ["CMYK", color.cmyk],
    ["RGB", color.rgb],
    ["HEX", color.hex],
  ];
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-ph">
      <div
        className={cn("flex flex-col justify-end gap-0.5 p-5", large ? "h-44" : "h-28")}
        style={{ backgroundColor: color.hex, color: color.light ? "#031530" : "#fff" }}
      >
        <span className={cn("font-extrabold", large ? "text-2xl" : "text-lg")}>{color.name}</span>
        <span className="text-xs font-semibold uppercase tracking-[.08em] opacity-85">{color.role}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="font-mono font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
