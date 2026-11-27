/** Нүүр хуудасны "Хүчин чадал" слайдер. Слайд нэмэх бол энд нэг объект нэмнэ. */
export type FleetSlide = {
  title: string;
  tag: string;
  image: string;
  /** Слайдын агуулгыг дэлгэц уншигчид тайлбарлах бичиг */
  label: string;
  /** Зургийн аль хэсгийг төвд нь харуулах (CSS object-position) */
  position: string;
  rentHref: string;
  moreHref: string;
};

export const fleet: FleetSlide[] = [
  {
    title: "Evolution ТЭ33АС зүтгүүр",
    tag: "Гол замын зүтгүүр · 4 ширхэг",
    image: "/images/huchin-chadal.jpg",
    label: "Бодь Рэйлийн ТЭ33АС-1001, 1002, 1004 зүтгүүрүүд өртөөнд зэрэгцэн зогсож буй нь",
    position: "center 60%",
    rentHref: "/uilchilgee#rent",
    moreHref: "#",
  },
  {
    title: "RM RAIL тавцант вагон",
    tag: "Тавцант вагон · 208 ширхэг",
    image: "/images/tavtsant-vagon.jpg",
    label: "Чингэлэг ачсан RM RAIL 13-1258-01 загварын тавцант вагон",
    position: "center 58%",
    rentHref: "/uilchilgee#rent",
    moreHref: "#",
  },
  {
    title: "Чингэлэг өргөгч",
    tag: "Чингэлэг өргөгч",
    image: "/images/chingeleg-urguguch.webp",
    label: "Чингэлэг өргөж буй чингэлэг өргөгч машин",
    position: "center 45%",
    rentHref: "/uilchilgee#rent",
    moreHref: "#",
  },
];
