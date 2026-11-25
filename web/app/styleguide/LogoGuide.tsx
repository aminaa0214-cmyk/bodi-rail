import { Brand } from "@/components/layout/Brand";
import { LogoSymbol } from "@/components/brand/Logo";
import { LOGO } from "@/components/brand/logo-geometry";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/*
 * Логоны стандарт: Бодь Группийн «Брэнд хөтөч», 2-р бүлэг «Логоны байгуулалт, стандарт» (х. 9–41).
 * Лого өөрөө брэндбүүкийн векторoос (components/brand/logo-geometry.ts). Өнгө, тоог энд шууд бичсэн.
 * Брэндбүүк шинэчлэгдвэл энэ файлыг шинэчилнэ.
 */

export const BRAND_BLUE = "#0072BC";

/* ---------- Лого (тэмдэг + бичиглэл) ---------- */

// Координат: тэмдгийн өндөр 100 нэгж. x = LOGO.unit (тэмдгийн ¼).
const U = LOGO.unit;
const SW = LOGO.symbolWidth;
const WS = LOGO.wordStart;
const WW = LOGO.wordEnd - LOGO.wordStart;
const CAP = LOGO.capBottom - LOGO.capTop;
/** Том үсгийн өндөр x-ээр (≈ 1.5) */
const CAP_X = (CAP / U).toFixed(1);

type LockupProps = {
  /** Тэмдгийн өндөр, px */
  size?: number;
  color?: string;
  textColor?: string;
  // Доорх тохиргоонууд зөвхөн «хориглох зүйлс»-ийн жишээнд
  symbolScale?: number;
  gap?: number;
  arrangement?: "row" | "reverse" | "stacked";
  stretch?: number;
  /** Өгвөл бичиглэлийн оронд энэ бичвэрийг фонтоор бичнэ */
  text?: string;
  textStyle?: React.CSSProperties;
  textOutline?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Брэндбүүкийн лого, өнгө ба харьцааг өөрчлөх боломжтой хувилбар.
 * Сайтад энгийн лого хэрэгтэй бол components/brand/Logo.tsx-ийн LogoLockup-ийг ашиглана.
 */
export function Lockup({
  size = 64,
  color = BRAND_BLUE,
  textColor,
  symbolScale = 1,
  gap = 1,
  arrangement = "row",
  stretch = 1,
  text,
  textStyle,
  textOutline,
  style,
  className,
}: LockupProps) {
  const s = 100 * symbolScale;
  const sW = SW * symbolScale;
  const g = gap * U;
  let w: number, h: number, sx: number, sy: number, dx: number, dy: number;

  if (arrangement === "stacked") {
    w = Math.max(WW, sW);
    h = s + g + CAP;
    [sx, sy] = [(w - sW) / 2, 0];
    [dx, dy] = [(w - WW) / 2 - WS, s + g - LOGO.capTop];
  } else {
    w = sW + g + WW;
    h = Math.max(s, 100);
    sy = (h - s) / 2;
    dy = (h - 100) / 2;
    [sx, dx] = arrangement === "reverse" ? [WW + g, -WS] : [0, sW + g - WS];
  }

  const k = size / 100;
  const fill = textColor ?? color;
  const asText = text !== undefined || textStyle !== undefined;

  return (
    <svg
      role="img"
      aria-label={text ?? site.brand}
      viewBox={`0 0 ${w} ${h}`}
      width={w * k * stretch}
      height={h * k}
      preserveAspectRatio={stretch === 1 ? undefined : "none"}
      className={cn("block h-auto max-w-full flex-none", className)}
      style={style}
    >
      <path d={LOGO.symbolD} transform={`translate(${sx} ${sy}) scale(${symbolScale})`} fill={color} />
      {asText ? (
        <text
          x={dx + WS}
          y={dy + LOGO.capBottom}
          fontSize={CAP / 0.727}
          fontWeight={800}
          fill={fill}
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", ...textStyle }}
        >
          {text ?? site.brand}
        </text>
      ) : (
        <path
          d={LOGO.wordD}
          transform={`translate(${dx} ${dy})`}
          fill={textOutline ? "none" : fill}
          stroke={textOutline ? fill : undefined}
          strokeWidth={textOutline ? 1.2 : undefined}
        />
      )}
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

/**
 * Тэмдгийн байгуулалт (брэндбүүк х. 10–11). Жижиг тойрог D (100%), том тойрог 1.3D (130%).
 * 4 хувилбарыг нэгнийх нь том тойрог нөгөөгийнхөө жижиг тойрогт шүргэлцэхээр (төв хоорондын
 * зай 1.15D) байрлуулж, төвд 5 дахийг тавина. Тэмдэг = 5 дахийн том тойргийн доторх хэсэг.
 */
function ConstructionDiagram() {
  const cx = SW / 2;
  const cy = 50;
  const R = 50; // том тойрог = тэмдгийн радиус
  const r = R / 1.3; // жижиг тойрог
  const off = (r + R) / 2; // булангийн төвүүдийн тэнхлэг дагуух шилжилт (1.15D / 2)
  const guide = { fill: "none", stroke: "#F58220", strokeWidth: 0.6, strokeDasharray: "2 1.6" } as const;
  return (
    <svg viewBox={`${cx - 95} ${cy - 95} 190 190`} className="h-auto w-full max-w-[320px]" aria-hidden="true">
      <path d={LOGO.symbolD} fill="#BACCEA" />
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy]) => (
        <g key={`${sx}${sy}`}>
          <circle cx={cx + sx * off} cy={cy + sy * off} r={r} {...guide} />
          <circle cx={cx + sx * off} cy={cy + sy * off} r={R} {...guide} strokeOpacity=".55" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#0072BC" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0072BC" strokeWidth="0.7" strokeDasharray="2 1.6" />
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
  const top = 30; // дээд талын хэмжээсийн бичгийн зай
  const x0 = U;
  const y0 = top + U;
  const boxW = LOGO.wordEnd + 2 * U;
  const boxH = 100 + 2 * U;
  const capTop = y0 + LOGO.capTop;
  const capBottom = y0 + LOGO.capBottom;
  const right = boxW + 14;
  const dash = { stroke: "#0072BC", strokeWidth: 1, strokeDasharray: "4 4", fill: "none" } as const;
  const orange = { stroke: "#F58220", strokeWidth: 1.5 } as const;
  const label = { fontSize: 13, fontWeight: 700, fill: "#F58220", textAnchor: "middle" } as const;
  const corners = [
    [0, top],
    [boxW - U, top],
    [0, top + boxH - U],
    [boxW - U, top + boxH - U],
  ];
  const dims: [number, number, string][] = [
    [0, U, "x"],
    [U, U + SW, "4x"],
    [U + SW, U + WS, "x"],
  ];

  return (
    <svg viewBox={`0 0 ${right + 40} ${top + boxH + 4}`} className="h-auto w-full" role="img" aria-label="Логоны сул зай ба хэмжээс">
      {corners.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={U} height={U} fill="#DCE3EC" />
      ))}
      <rect x="0" y={top} width={boxW} height={boxH} {...dash} />
      <rect x={x0} y={y0} width={LOGO.wordEnd} height="100" {...dash} strokeDasharray="2 3" />
      <line x1={x0 + WS} y1={capTop} x2={right} y2={capTop} {...dash} stroke="#F58220" />
      <line x1={x0 + WS} y1={capBottom} x2={right} y2={capBottom} {...dash} stroke="#F58220" />

      <g transform={`translate(${x0} ${y0})`} fill={BRAND_BLUE}>
        <path d={LOGO.symbolD} />
        <path d={LOGO.wordD} />
      </g>

      {/* Дээд талын хэмжээс: x · 4x · x */}
      {dims.map(([a, b, t]) => (
        <g key={a}>
          <line x1={a} y1="14" x2={b} y2="14" {...orange} />
          <line x1={a} y1="9" x2={a} y2="19" {...orange} />
          <line x1={b} y1="9" x2={b} y2="19" {...orange} />
          <text x={(a + b) / 2} y="8" {...label}>
            {t}
          </text>
        </g>
      ))}
      {/* Баруун талын хэмжээс: том үсгийн өндөр */}
      <line x1={right} y1={capTop} x2={right} y2={capBottom} {...orange} />
      <text x={right + 22} y={(capTop + capBottom) / 2 + 5} {...label}>
        {CAP_X}x
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
          Албан ёсны фонт: <strong>Futuris</strong>, Bold, бүгд том үсгээр (UPPERCASE). «BODI RAIL» бичиглэлийг
          брэндбүүкийн логоны Futuris үсгүүдээс угсарсан тул фонт суулгах шаардлагагүй. Логог үргэлж бэлэн файлаас
          (<code className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[13px]">/images/logo-full.svg</code>)
          ашиглана, бичвэрээр бичиж болохгүй.
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
              <LogoSymbol className="h-[38px] w-auto text-brand" />
              <Ruler width={38} label="1 см" />
            </div>
          </Panel>
          <Panel caption="Бүтэн лого ≥ 4 см (151px)" className="min-h-40">
            <div className="flex flex-col items-start gap-2">
              <Lockup size={(151 * 100) / LOGO.wordEnd} />
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
