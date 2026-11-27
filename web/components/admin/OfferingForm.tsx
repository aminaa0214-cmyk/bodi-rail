import { saveOffering } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Checkbox, FileInput, Grid, Input, Panel, Select, Textarea } from "@/components/admin/fields";

export type OfferingRow = {
  id: number;
  section: "home" | "sale" | "rental";
  sort_order: number;
  tag: string | null;
  title: string;
  body: string | null;
  details: string[];
  href: string | null;
  image_src: string | null;
  image_alt: string | null;
  image_position: string | null;
  placeholder: string | null;
  is_active: boolean;
};

export const SECTIONS = [
  { value: "rental", label: "Түрээс (Үйлчилгээ хуудас)" },
  { value: "sale", label: "Худалдаа (Худалдаа хуудас)" },
  { value: "home", label: "Нүүр хуудас — Бидний үйлчилгээ" },
];

export function OfferingForm({ offering, section }: { offering?: OfferingRow; section?: string }) {
  return (
    <AdminForm action={saveOffering} submitLabel={offering ? "Хадгалах" : "Нэмэх"}>
      <input type="hidden" name="id" value={offering?.id ?? ""} />
      <input type="hidden" name="image_current" value={offering?.image_src ?? ""} />

      <Panel title="Карт">
        <Grid>
          <Select label="Хаана харагдах" name="section" required options={SECTIONS} defaultValue={offering?.section ?? section ?? "rental"} />
          <Input label="Гарчиг" name="title" required defaultValue={offering?.title} hint="Жишээ: Evolution ТЭ33АС зүтгүүр" />
          <Input label="Шошго" name="tag" defaultValue={offering?.tag} hint="Түрээсийн картын дээрх шошго. Жишээ: Зүтгүүр, Вагон" />
          <Input label="Дараалал" name="sort_order" type="number" defaultValue={offering?.sort_order ?? 100} hint="Бага тоо нь эхэнд" />
        </Grid>
        <Textarea
          label="Текст"
          name="body"
          rows={3}
          defaultValue={offering?.body}
          hint="Мөр бүр тусдаа харагдана. Жишээ: “Гол замын зүтгүүр” ↵ “Тоо: 4”"
        />
        <Textarea
          label="Үзүүлэлтүүд (хүчин чадал)"
          name="details"
          rows={6}
          defaultValue={offering?.details.join("\n")}
          hint="Мөр бүрт нэг үзүүлэлт, жагсаалтаар харагдана. Жишээ: Даац: 72 т"
        />
        <Input label="“Дэлгэрэнгүй” холбоос" name="href" defaultValue={offering?.href} hint="Зөвхөн нүүр хуудасны картад. Жишээ: /uilchilgee#rent" />
        <Checkbox label="Сайтад харуулах" name="is_active" defaultChecked={offering?.is_active ?? true} />
      </Panel>

      <Panel title="Зураг">
        {offering?.image_src && (
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={offering.image_src} alt="" className="h-44 w-full max-w-sm rounded-[10px] object-cover" />
            <Checkbox label="Зургийг хасах" name="image_remove" />
          </div>
        )}
        <Grid>
          <FileInput label={offering?.image_src ? "Зургийг солих" : "Зураг"} name="image_file" />
          <Input label="Зургийн тайлбар (alt)" name="image_alt" defaultValue={offering?.image_alt} hint="Хоосон бол гарчгийг ашиглана" />
          <Input
            label="Зургийн төвлөрөл"
            name="image_position"
            defaultValue={offering?.image_position}
            hint="Зургийн аль хэсэг харагдах. Жишээ: 70% center"
          />
          <Input label="Зураггүй үеийн бичиг" name="placeholder" defaultValue={offering?.placeholder} hint="Саарал орлуулга дээр харагдана" />
        </Grid>
      </Panel>
    </AdminForm>
  );
}
