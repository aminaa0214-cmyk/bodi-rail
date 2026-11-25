/**
 * Онлайн анкетын бүтэц. Маягт (components/forms/ApplicationForm.tsx) болон
 * и-мэйл илгээх Server Action (app/actions/send-application.ts) хоёулаа үүнийг ашиглана.
 * Талбар нэмэх, хасах бол зөвхөн энд өөрчилнө.
 */
import { jobs } from "@/content/jobs";

export type FieldType = "text" | "tel" | "email" | "url" | "number" | "date" | "month" | "select" | "textarea";

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  /** Маягтын бүтэн мөрийг эзлэх */
  full?: boolean;
  options?: readonly string[];
  placeholder?: string;
  hint?: string;
  pattern?: string;
  rows?: number;
  autoComplete?: string;
};

/** "+ нэмэх" товчтой, давтагддаг мөр (сургууль, ажлын туршлага г.м) */
export type GroupDef = {
  key: string;
  title: string;
  hint?: string;
  addLabel?: string;
  /** Анхнаасаа харагдах мөрийн тоо */
  min?: number;
  /** Мөрийн дээд тоо. min === max бол нэмэх, устгах товчгүй */
  max?: number;
  fields: FieldDef[];
};

export type ChoiceDef = {
  name: string;
  label: string;
  kind: "checkbox" | "radio";
  options: readonly string[];
};

export type PartItem =
  | { kind: "fields"; title?: string; hint?: string; fields: FieldDef[] }
  | { kind: "group"; group: GroupDef }
  | { kind: "choice"; title?: string; choice: ChoiceDef };

export type PartDef = { legend: string; items: PartItem[] };

const LEVELS = ["Анхан", "Дунд", "Ахисан"] as const;
const YES_NO = ["Үгүй", "Тийм"] as const;

/** Регистрийн дугаар: 2 кирилл үсэг + 8 тоо */
export const REGISTER_PATTERN = "[А-ЯӨҮЁа-яөүё]{2}[0-9]{8}";
export const PHONE_PATTERN = "[0-9+ \\-]{8,15}";

const school: FieldDef[] = [
  { name: "start", label: "Элссэн огноо", type: "month" },
  { name: "end", label: "Төгссөн огноо", type: "month" },
  { name: "place", label: "Хаана (улс, хот, аймаг)" },
  { name: "name", label: "Сургуулийн нэр" },
  { name: "major", label: "Эзэмшсэн мэргэжил" },
  { name: "level", label: "Боловсролын түвшин" },
  { name: "gpa", label: "Голч дүн" },
];

const work: FieldDef[] = [
  { name: "org", label: "Байгууллагын нэр" },
  { name: "industry", label: "Үйл ажиллагааны чиглэл" },
  { name: "manager", label: "Удирдлага" },
  { name: "title", label: "Албан тушаал" },
  { name: "start", label: "Ажилд орсон огноо", type: "month" },
  { name: "end", label: "Ажлаас гарсан огноо", type: "month" },
  { name: "reason", label: "Гарсан шалтгаан" },
  { name: "salary", label: "Үндсэн цалин" },
  { name: "duties", label: "Чиг үүрэг", type: "textarea", full: true, rows: 2 },
];

const person: FieldDef[] = [
  { name: "relation", label: "Таны хэн болох" },
  { name: "name", label: "Овог, нэр" },
  { name: "birth_date", label: "Төрсөн огноо", type: "date" },
  { name: "birth_place", label: "Төрсөн газар" },
  { name: "work_place", label: "Ажилладаг газар" },
  { name: "org", label: "Байгууллагын нэр" },
  { name: "title", label: "Албан тушаал" },
  { name: "phone", label: "Холбоо барих утас", type: "tel" },
];

export const applicationParts: PartDef[] = [
  {
    legend: "Ажлын байр",
    items: [
      {
        kind: "fields",
        fields: [
          { name: "position_1", label: "Албан тушаал 1", type: "select", required: true, options: jobs.map((j) => j.title) },
          { name: "position_2", label: "Албан тушаал 2", placeholder: "Сонирхож буй өөр албан тушаал" },
          { name: "expected_salary", label: "Таны хүсч буй цалин", placeholder: "₮" },
          { name: "available_date", label: "Ажилд орох боломжтой огноо", type: "date" },
          { name: "register_no", label: "Регистрийн дугаар", required: true, pattern: REGISTER_PATTERN, placeholder: "АА00000000" },
          { name: "phone", label: "Холбоо барих утас", type: "tel", required: true, pattern: PHONE_PATTERN, autoComplete: "tel" },
          { name: "email", label: "Имэйл хаяг", type: "email", required: true, autoComplete: "email" },
          { name: "linkedin", label: "LinkedIn хаяг", type: "url", placeholder: "https://linkedin.com/in/..." },
        ],
      },
    ],
  },
  {
    legend: "1. Үндсэн мэдээлэл",
    items: [
      {
        kind: "fields",
        fields: [
          { name: "clan_name", label: "Ургийн овог" },
          { name: "last_name", label: "Эцэг/эхийн нэр", required: true, autoComplete: "family-name" },
          { name: "first_name", label: "Өөрийн нэр", required: true, autoComplete: "given-name" },
          { name: "birth_place", label: "Төрсөн газар" },
          { name: "birth_date", label: "Төрсөн огноо", type: "date", required: true },
          { name: "gender", label: "Хүйс", type: "select", required: true, options: ["Эрэгтэй", "Эмэгтэй"] },
          { name: "address", label: "Оршин суугаа хаяг", required: true, full: true, autoComplete: "street-address" },
          { name: "emergency_name", label: "Яаралтай үед холбоо барих хүний нэр", required: true },
          { name: "emergency_phone", label: "Түүний утасны дугаар", type: "tel", required: true, pattern: PHONE_PATTERN },
        ],
      },
    ],
  },
  {
    legend: "2. Боловсрол, ур чадвар",
    items: [
      {
        kind: "fields",
        fields: [
          {
            name: "education_level",
            label: "2.1 Боловсролын түвшин",
            type: "select",
            required: true,
            options: ["Бүрэн дунд", "Техникийн болон мэргэжлийн", "Дипломын дээд", "Бакалавр", "Магистр", "Доктор"],
          },
        ],
      },
      { kind: "group", group: { key: "school", title: "2.2 Ерөнхий боловсролын мэдээлэл", addLabel: "Сургууль нэмэх", min: 1, fields: school } },
      { kind: "group", group: { key: "university", title: "2.3 Их дээд сургуулийн мэдээлэл", addLabel: "Сургууль нэмэх", min: 1, fields: school } },
      {
        kind: "group",
        group: {
          key: "qualification",
          title: "2.4 Мэргэшсэн байдал",
          hint: "мэргэшсэн инженер, мэргэшсэн нягтлан бодогч г.м",
          addLabel: "Мэргэшил нэмэх",
          fields: [
            { name: "date", label: "Огноо", type: "month" },
            { name: "name", label: "Мэргэшил" },
            { name: "note", label: "Тайлбар" },
          ],
        },
      },
      {
        kind: "group",
        group: {
          key: "training",
          title: "2.5 Хамрагдаж байсан сургалт, дадлага",
          addLabel: "Сургалт нэмэх",
          fields: [
            { name: "date", label: "Огноо", type: "month" },
            { name: "duration", label: "Үргэлжилсэн хугацаа" },
            { name: "place", label: "Хаана" },
            { name: "org", label: "Ямар байгууллагад" },
            { name: "topic", label: "Ямар чиглэлээр" },
          ],
        },
      },
      {
        kind: "group",
        group: {
          key: "language",
          title: "2.6 Гадаад хэлний мэдлэг",
          addLabel: "Хэл нэмэх",
          fields: [
            { name: "name", label: "Гадаад хэлний нэр" },
            { name: "level", label: "Түвшин", type: "select", options: [...LEVELS, "Чөлөөтэй"] },
          ],
        },
      },
      {
        kind: "group",
        group: {
          key: "exam",
          title: "2.7 Гадаад хэлний түвшин тогтоох шалгалт",
          hint: "IELTS, TOEFL, GMAT г.м",
          addLabel: "Шалгалт нэмэх",
          fields: [
            { name: "name", label: "Шалгалтын нэр" },
            { name: "date", label: "Шалгалт өгсөн огноо", type: "month" },
            { name: "score", label: "Шалгалтын оноо" },
          ],
        },
      },
      {
        kind: "fields",
        title: "2.8 Компьютерийн мэдлэг",
        fields: [
          { name: "pc_excel", label: "MS Excel", type: "select", options: LEVELS },
          { name: "pc_word", label: "MS Word", type: "select", options: LEVELS },
          { name: "pc_powerpoint", label: "MS PowerPoint", type: "select", options: LEVELS },
          { name: "pc_outlook", label: "MS Outlook", type: "select", options: LEVELS },
          { name: "pc_internet", label: "Интернэт орчин", type: "select", options: LEVELS },
          { name: "pc_other", label: "Бусад програм", placeholder: "Програмын нэр, түвшин" },
        ],
      },
    ],
  },
  {
    legend: "3. Ажлын туршлага",
    items: [
      {
        kind: "group",
        group: {
          key: "job_official",
          title: "3.1 Хөдөлмөрийн дэвтэр болон НДД-ээр баталгаажсан ажлын туршлага",
          hint: "хамгийн сүүлд эрхэлсэн ажлаас эхлэн",
          addLabel: "Ажлын туршлага нэмэх",
          min: 1,
          fields: work,
        },
      },
      {
        kind: "group",
        group: {
          key: "job_other",
          title: "3.2 Хөдөлмөрийн дэвтэр болон НДД-ээр баталгаажаагүй ажлын туршлага",
          hint: "хувиараа хөдөлмөр эрхлэлт",
          addLabel: "Ажлын туршлага нэмэх",
          fields: work,
        },
      },
      {
        kind: "fields",
        fields: [
          { name: "unemployed_reason", label: "3.3 Хэрэв та удаан хугацаагаар ажил эрхлээгүй бол шалтгаанаа бичнэ үү", type: "textarea", full: true, rows: 3 },
        ],
      },
    ],
  },
  {
    legend: "4. Гэр бүлийн байдал",
    items: [
      { kind: "fields", fields: [{ name: "family_size", label: "4.1 Ам бүлийн тоо", type: "number" }] },
      { kind: "group", group: { key: "family", title: "4.2 Гэр бүлийн байдал", hint: "зөвхөн хамт амьдарч байгаа хүмүүс", addLabel: "Хүн нэмэх", fields: person } },
      { kind: "group", group: { key: "relatives", title: "4.3 Ураг төрлийн байдал", hint: "өрх тусгаар эцэг, эх, ах, эгч, дүү", addLabel: "Хүн нэмэх", fields: person } },
      { kind: "group", group: { key: "bodi_relatives", title: "4.4 Бодь Группт ажилладаг ураг төрөл, найз нөхөд", addLabel: "Хүн нэмэх", fields: person } },
    ],
  },
  {
    legend: "5. Хувь хүний онцлог",
    items: [
      {
        kind: "group",
        group: {
          key: "talent",
          title: "5.1 Урлаг, спортын авъяас",
          addLabel: "Нэмэх",
          fields: [
            { name: "type", label: "Урлаг / спортын төрөл" },
            { name: "years", label: "Хичээллэсэн хугацаа" },
            { name: "rank", label: "Зэрэг / шагналтай эсэх" },
          ],
        },
      },
      {
        kind: "group",
        group: {
          key: "award",
          title: "5.2 Гавъяа шагнал",
          addLabel: "Нэмэх",
          fields: [
            { name: "name", label: "Шагналын нэр" },
            { name: "date", label: "Шагнагдсан огноо", type: "month" },
            { name: "place", label: "Хаана ажиллах хугацаандаа" },
          ],
        },
      },
    ],
  },
  {
    legend: "6. Бусад",
    items: [
      {
        kind: "fields",
        title: "6.1 Эрүүл мэндийн байдал",
        fields: [
          { name: "allergy", label: "Харшил байдаг эсэх", type: "select", options: YES_NO },
          { name: "allergy_note", label: "Тайлбар" },
          { name: "health_note", label: "Бусад архаг өвчин, анхаарах зүйл", type: "textarea", full: true, rows: 2 },
        ],
      },
      {
        kind: "fields",
        title: "6.2 Шийтгэл",
        hint: "ял шийтгэл эсвэл сахилгын арга хэмжээ авагдсан эсэх",
        fields: [
          { name: "penalty", label: "Шийтгэл авч байсан эсэх", type: "select", options: YES_NO },
          { name: "penalty_note", label: "Тайлбар (төрөл, огноо, хаана ажиллах хугацаандаа)" },
        ],
      },
      {
        kind: "group",
        group: {
          key: "loan",
          title: "6.3 Зээлийн мэдээлэл",
          addLabel: "Зээл нэмэх",
          fields: [
            { name: "type", label: "Зээлийн төрөл" },
            { name: "balance", label: "Үлдэгдэл" },
            { name: "end", label: "Дуусах хугацаа", type: "month" },
            { name: "note", label: "Тайлбар" },
          ],
        },
      },
      {
        kind: "choice",
        title: "6.4 Жолооны үнэмлэх",
        choice: { name: "license_class", label: "Ангилал", kind: "checkbox", options: ["A", "B", "C", "D", "E", "M"] },
      },
      { kind: "fields", fields: [{ name: "driving_years", label: "Хэдэн жил автомашин жолоодож байгаа", type: "number" }] },
    ],
  },
  {
    legend: "7. Таны зорилго",
    items: [
      {
        kind: "fields",
        fields: [
          { name: "goals", label: "7.1 Таны ойрын гурван жилийн зорилго", type: "textarea", full: true, rows: 3 },
          { name: "motivation", label: "7.2 Таныг идэвхжүүлдэг зүйлс", type: "textarea", full: true, rows: 2 },
          { name: "strengths", label: "7.3 Таны давуу тал", type: "textarea", rows: 3 },
          { name: "weaknesses", label: "Таны сул тал", type: "textarea", rows: 3 },
        ],
      },
      {
        kind: "group",
        group: {
          key: "reference",
          title: "7.4 Таныг сайн тодорхойлох хоёр хүн",
          hint: "хамаатан садан, найз нөхөд байж болохгүй",
          min: 2,
          max: 2,
          fields: [
            { name: "name", label: "Нэр" },
            { name: "job", label: "Эрхэлдэг ажил" },
            { name: "phone", label: "Холбоо барих утас", type: "tel" },
            { name: "note", label: "Тайлбар" },
          ],
        },
      },
      {
        kind: "fields",
        fields: [
          {
            name: "about_me",
            label: "7.5 Өөрийн талаар нэмж танилцуулах зүйлс (нийгмийн идэвхи, оролцоо, гишүүнчлэл г.м)",
            type: "textarea",
            full: true,
            rows: 3,
          },
        ],
      },
      {
        kind: "choice",
        choice: {
          name: "source",
          label: "Ажлын байрны зарыг хаанаас мэдсэн бэ?",
          kind: "radio",
          options: ["Их дээд сургуулиас", "Веб сайтаас", "Найз нөхөд, төрөл садангаас", "Бусад"],
        },
      },
    ],
  },
];

/** Хавсралт файлууд */
export type FileDef = {
  name: string;
  label: string;
  hint?: string;
  /** always: үргэлж заавал, rail: RAIL_POSITIONS-д заавал */
  required?: "always" | "rail";
  imageOnly?: boolean;
  multiple?: boolean;
};

export const applicationFiles: FileDef[] = [
  { name: "photo", label: "Цээж зураг", required: "always", imageOnly: true },
  { name: "diploma", label: "Их дээд сургуулийн диплом", required: "always" },
  { name: "professional_certificate", label: "Мэргэжлийн үнэмлэх", required: "always" },
  { name: "id_card", label: "Иргэний үнэмлэх", hint: "e-Mongolia-гаас татсан лавлагаа байж болно", required: "rail" },
  { name: "work_reference", label: "Өмнөх байгууллагын ажил байдлын тодорхойлолт", required: "rail" },
  { name: "school_certificate", label: "ЕБС-ийн гэрчилгээ" },
  { name: "other_docs", label: "Бусад баримт", hint: "намтар, тодорхойлолт г.м", multiple: true },
];

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ACCEPT_ATTR = ".pdf,image/jpeg,image/png";

/**
 * Нийт хавсралтын дээд хэмжээ. Vercel нэг хүсэлтэд 4.5 MB-аас их өгөгдөл хүлээж авдаггүй тул
 * текстэд зай үлдээж 4 MB болгосон. Хөтөч дээр зургийг илгээхээс өмнө шахна.
 */
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const MAX_TOTAL_LABEL = "4 MB";

export const CONSENT_FIELDS = {
  consent:
    "Ажилд орохыг хүссэн миний талаарх мэдээллийг “Бодь Рэйл” ХХК-ийн зүгээс тодруулах эрхийг хүлээн зөвшөөрч байна. Мөн худал мэдээлэл өгч эсхүл аливаа мэдээллийг нуун дарагдуулж ажилд орсон тохиолдолд ажлаас халагдана гэдгийг хүлээн зөвшөөрч, гомдол гаргахгүй байх болно.",
  privacy_consent: "Миний хувийн мэдээллийг зөвхөн ажилтан сонгон шалгаруулах зорилгоор боловсруулахыг зөвшөөрч байна.",
} as const;

/** Repeat мөрийн талбарын нэр: school.0.name */
export function groupFieldName(group: string, index: number, field: string) {
  return `${group}.${index}.${field}`;
}

export type ApplicationResult =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };
