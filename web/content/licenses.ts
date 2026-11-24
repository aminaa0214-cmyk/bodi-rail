export type License = {
  title: string;
  image: string;
  alt: string;
  issuer: string;
  number: string;
  validity: string;
};

/** Тусгай зөвшөөрлийн зургууд 1241×1754 хэмжээтэй (A4). */
export const LICENSE_IMAGE_SIZE = { width: 1241, height: 1754 } as const;

export const licenses: License[] = [
  {
    title: "Төмөр замын тээвэрлэлтийн үйл ажиллагаа эрхлэх",
    image: "/images/licenses/teever.jpg",
    alt: "Төмөр замын тээвэрлэлтийн үйл ажиллагаа эрхлэх тусгай зөвшөөрөл, ТҮА/045-2024",
    issuer: "Зам, тээврийн яам",
    number: "ТҮА/045-2024",
    validity: "2024.12.27-оос 5 жил",
  },
  {
    title: "Төмөр замын хөдлөх бүрэлдэхүүн засварлах",
    image: "/images/licenses/zasvar.jpg",
    alt: "Төмөр замын хөдлөх бүрэлдэхүүн засварлах тусгай зөвшөөрөл, ХБЗ 3/031-2025",
    issuer: "Зам, тээврийн яам",
    number: "ХБЗ 3/031-2025",
    validity: "2025.04.10-аас 5 жил",
  },
  {
    title: "Төмөр замын тээвэр зуучлал",
    image: "/images/licenses/zuuchlal.jpg",
    alt: "Төмөр замын тээвэр зуучлалын гэрчилгээ, 25/А49/110",
    issuer: "Төмөр замын газар",
    number: "25/А49/110 (код У-8)",
    validity: "2025.09.23 – 2028.09.23",
  },
];
