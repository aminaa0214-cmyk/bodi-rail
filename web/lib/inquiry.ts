/**
 * Маягт бүрийн и-мэйлийн гарчиг, талбаруудын нэр.
 * Талбарын `name` (жишээ нь "phone") нь маягтын <input name="..."> -тэй таарах ёстой.
 * И-мэйлд талбарууд энд бичигдсэн дарааллаар гарна.
 */
export type InquiryFormConfig = {
  subject: string;
  required: readonly string[];
  fields: Readonly<Record<string, string>>;
};

export const inquiryForms = {
  quote: {
    subject: "Үнийн санал авах хүсэлт",
    required: ["name", "phone"],
    fields: {
      name: "Овог, нэр",
      company: "Байгууллагын нэр",
      phone: "Утас",
      email: "И-мэйл",
      product: "Бүтээгдэхүүн",
      quantity: "Загвар, тоо ширхэг",
      message: "Нэмэлт мэдээлэл",
    },
  },
  order: {
    subject: "Тээврийн захиалга",
    required: ["from", "to", "tonnes", "name", "phone"],
    fields: {
      from: "Хаанаас (ачих өртөө)",
      to: "Хаашаа (буулгах өртөө)",
      cargo_type: "Ачааны төрөл",
      tonnes: "Ачааны хэмжээ (тонн)",
      wagon_type: "Вагоны төрөл",
      date: "Ачих огноо",
      frequency: "Тээврийн давтамж",
      name: "Овог, нэр",
      company: "Байгууллагын нэр",
      phone: "Утас",
      email: "И-мэйл",
      message: "Нэмэлт мэдээлэл",
    },
  },
  service: {
    subject: "Түрээс, үйлчилгээний хүсэлт",
    required: ["name", "phone"],
    fields: {
      name: "Овог, нэр",
      company: "Байгууллагын нэр",
      phone: "Утас",
      email: "И-мэйл",
      service: "Үйлчилгээ",
      message: "Хүсэлтийн дэлгэрэнгүй",
    },
  },
} as const satisfies Record<string, InquiryFormConfig>;

export type InquiryKind = keyof typeof inquiryForms;

export type InquiryResult =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

/** Спам бот бөглөдөг, хүнд харагдахгүй талбар */
export const HONEYPOT_FIELD = "website";
