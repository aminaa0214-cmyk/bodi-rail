/** Сайт даяар давтагддаг мэдээлэл: холбоо барих, цэс, сошиал. */

export const site = {
  name: "Бодь Рэйл ХХК",
  brand: "BODI RAIL",
  url: "https://bodirail.mn",
  title: "Бодь Рэйл ХХК | Тээвэр логистикийн компани",
  description:
    "Төмөр замын ачаа тээвэр, зүтгүүр, вагон, сэлбэгийн нийлүүлэлт, хөдлөх бүрэлдэхүүний түрээс, ТЭ33АС зүтгүүрийн засвар үйлчилгээ.",
  about:
    "“Бодь Рэйл” ХХК нь Бодь Группийн тээвэр логистикийн компани. Төмөр замын ачаа тээвэр, хөдлөх бүрэлдэхүүний нийлүүлэлт, түрээс, засвар үйлчилгээ.",
  parent: { name: "Бодь Групп", url: "https://www.bodigroup.mn/" },
  tagline: "Бодь Группийн охин компани",
} as const;

export const contact = {
  phone: { display: "+976 8840-2530", href: "tel:+97688402530" },
  email: "info@bodirail.mn",
  address:
    "14241 Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Чингисийн өргөн чөлөө 24, “Парк Плэйс” оффис, 5-р давхар, 508 тоот",
  hours: "Даваа–Баасан [09:00–18:00]",
  map: {
    embed: "https://maps.google.com/maps?q=47.9101103,106.9149699&z=17&output=embed",
    link: "https://maps.app.goo.gl/UR86zFNCrqFjr8FC8",
    title: "Бодь Рэйлийн оффисын байршил: Парк Плэйс",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Энэ замаар эхэлсэн хуудсанд цэс идэвхтэй харагдана. */
  activePrefix?: string;
};

export const mainNav: NavItem[] = [
  { label: "Бидний тухай", href: "/#about" },
  { label: "Худалдаа", href: "/hudaldaa", activePrefix: "/hudaldaa" },
  { label: "Үйлчилгээ", href: "/uilchilgee", activePrefix: "/uilchilgee" },
  { label: "Мэдээ", href: "/#news", activePrefix: "/medee" },
  { label: "Хүний нөөц", href: "#" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Цэс",
    links: [
      { label: "Бидний тухай", href: "/#about" },
      { label: "Худалдаа", href: "/hudaldaa" },
      { label: "Үйлчилгээ", href: "/uilchilgee" },
      { label: "Мэдээ", href: "/#news" },
    ],
  },
  {
    title: "Хүний нөөц",
    links: [
      { label: "Нээлттэй ажлын байр", href: "#" },
      { label: "Анкет илгээх", href: "#" },
      { label: "Бодь Групп", href: "https://www.bodigroup.mn/" },
    ],
  },
];

export const social = [
  { label: "Facebook", short: "FB", href: "#" },
  { label: "Instagram", short: "IG", href: "#" },
  { label: "LinkedIn", short: "IN", href: "#" },
  { label: "YouTube", short: "YT", href: "#" },
] as const;
