export type Partner = {
  name: string;
  logo: string;
  /** Логоны зурагт ирмэгийн цагаан зай их байвал томруулна */
  zoom?: boolean;
};

export const domesticPartners: Partner[] = [
  { name: "Улаанбаатар төмөр зам ХНН", logo: "/images/partners/ulaanbaatar-tumur-zam.jpg" },
  { name: "Монголын төмөр зам ТӨХК", logo: "/images/partners/mongolyn-tumur-zam.png" },
  { name: "Mongolian Trans Line", logo: "/images/partners/mongolian-trans-line.jpg" },
  { name: "Energy Resources", logo: "/images/partners/energy-resources.webp" },
];

export const foreignPartners: Partner[] = [
  { name: "Wabtec Corporation", logo: "/images/partners/wabtec.webp", zoom: true },
  { name: "Progress Rail, A Caterpillar Company", logo: "/images/partners/progress-rail.jpg" },
  { name: "RM Rail", logo: "/images/partners/rm-rail.webp" },
  { name: "CRRC Corporation", logo: "/images/partners/crrc.webp" },
];
