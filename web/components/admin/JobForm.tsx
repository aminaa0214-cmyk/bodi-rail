import { saveJob } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Checkbox, Grid, Input, Panel, Textarea } from "@/components/admin/fields";

export type JobRow = {
  id: number;
  sort_order: number;
  tag: string;
  title: string;
  hours: string;
  summary: string;
  duties: string[];
  requirements: string[];
  requires_driver_license: boolean;
  requires_rail_documents: boolean;
  is_active: boolean;
};

export function JobForm({ job }: { job?: JobRow }) {
  return (
    <AdminForm action={saveJob} submitLabel={job ? "Хадгалах" : "Ажлын зар нэмэх"}>
      <input type="hidden" name="id" value={job?.id ?? ""} />

      <Panel title="Ажлын байр">
        <Grid>
          <Input label="Албан тушаал" name="title" required full defaultValue={job?.title} hint="Анкетын “Албан тушаал” сонголтод мөн харагдана" />
          <Input label="Ангилал" name="tag" required defaultValue={job?.tag} hint="Жишээ: Тээвэр, Санхүү, Захиргаа" />
          <Input label="Ажлын цаг" name="hours" required defaultValue={job?.hours} hint="Жишээ: Бүтэн цаг, Ээлжээр" />
          <Input label="Дараалал" name="sort_order" type="number" defaultValue={job?.sort_order ?? 100} hint="Бага тоо нь эхэнд харагдана" />
        </Grid>
        <Textarea label="Товч тайлбар" name="summary" required rows={3} defaultValue={job?.summary} />
        <Checkbox label="Сайтад харуулах" name="is_active" defaultChecked={job?.is_active ?? true} />
      </Panel>

      <Panel title="Дэлгэрэнгүй">
        <Textarea label="Гүйцэтгэх үндсэн үүрэг" name="duties" rows={6} defaultValue={job?.duties.join("\n")} hint="Мөр бүрт нэг үүрэг" />
        <Textarea label="Тавигдах шаардлага" name="requirements" rows={6} defaultValue={job?.requirements.join("\n")} hint="Мөр бүрт нэг шаардлага" />
      </Panel>

      <Panel title="Анкетын шаардлага">
        <div className="flex flex-col gap-1">
          <Checkbox label="Жолооны үнэмлэхний ангилал заавал" name="requires_driver_license" defaultChecked={job?.requires_driver_license} />
          <Checkbox
            label="Иргэний үнэмлэх, ажил байдлын тодорхойлолт заавал хавсаргана"
            name="requires_rail_documents"
            defaultChecked={job?.requires_rail_documents}
          />
        </div>
      </Panel>
    </AdminForm>
  );
}
