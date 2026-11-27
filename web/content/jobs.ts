/**
 * Хүний нөөц хуудасны "Бид санал болгоно" хэсгийн хангамж.
 * Нээлттэй ажлын байр Supabase-ийн jobs хүснэгтэд байна (lib/data.ts → getJobs).
 */

export type Benefit = { icon: BenefitIcon; title: string; text: string };
export type BenefitIcon = "trophy" | "wallet" | "meal" | "clock" | "growth" | "team";

export const benefits: Benefit[] = [
  { icon: "trophy", title: "Гүйцэтгэлийн урамшуулал", text: "Улирал бүр гүйцэтгэлийн үр дүнгийн урамшуулал олгоно." },
  { icon: "wallet", title: "Тэтгэврийн хуримтлал", text: "Сар бүр Ард тэтгэврийн хуримтлалын санд 100,000₮-ийн хамтын хадгаламж." },
  { icon: "meal", title: "Өдрийн хоолны мөнгө", text: "Өдрийн хоолны мөнгийг цалин дээр нэмж олгоно." },
  { icon: "clock", title: "Уян хатан цаг", text: "Ажлын онцлогт тохирсон цагийн уян хатан нөхцөл." },
  { icon: "growth", title: "Өсөн дэвших боломж", text: "Мэргэжлээрээ хөгжиж, карьераа ахиулах боломж." },
  { icon: "team", title: "Залуу хамт олон", text: "Төмөр замын салбарт инноваци нэвтрүүлж буй шинийг эрэлхийлэгч, залуу хамт олон." },
];
