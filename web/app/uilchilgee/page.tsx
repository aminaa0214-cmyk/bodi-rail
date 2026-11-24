import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardText, CardTitle } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stats } from "@/components/ui/Stats";
import { Tag } from "@/components/ui/Tag";
import { Checklist, DarkCard, RouteChips } from "@/components/sections/Lists";
import { Split, SplitMedia, SplitText } from "@/components/sections/Split";
import { StepList } from "@/components/sections/Steps";
import { ContactBox, FormIntro, FormSection } from "@/components/forms/FormSection";
import { FormFieldset, FormGrid, SelectField, TextareaField, TextField, UnitField } from "@/components/forms/Field";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Үйлчилгээ",
  description:
    "Төмөр замын ачаа тээвэр, хөдлөх бүрэлдэхүүний түрээс, ТЭ33АС зүтгүүрийн засвар, ачаа тээврийн зөвлөх үйлчилгээ.",
};

const rentals = [
  {
    tag: "Зүтгүүр",
    title: "Evolution ТЭ33АС зүтгүүр",
    meta: ["Гол замын зүтгүүр", "Тоо: 4 (ТЭ33АС-1001–1004)"],
    placeholder: "ТЭ33АС зүтгүүр",
  },
  {
    tag: "Вагон",
    title: "Тавцант вагон",
    meta: ["RM RAIL үйлдвэрийн 12-58 загвар", "Тоо: 200"],
    placeholder: "тавцант вагон",
  },
  {
    tag: "Чингэлэг өргөгч",
    title: "Чингэлэг өргөгч",
    meta: ["Брэнд: Kalmar (Калмар)", "Тоо: [тоо]"],
    placeholder: "Калмар чингэлэг өргөгч",
  },
];

const serviceOptions = [
  "Түрээс: ТЭ33АС зүтгүүр",
  "Түрээс: Тавцант вагон",
  "Түрээс: Чингэлэг өргөгч",
  "Түрээс: Бусад хөдлөх бүрэлдэхүүн",
  "ТЭ33АС зүтгүүрийн засвар үйлчилгээ",
  "Ачаа тээврийн зөвлөх үйлчилгээ",
  "Ачилт, буулгалт",
  "Тээвэр зууч, гаалийн зууч",
];

export default function UilchilgeePage() {
  return (
    <>
      <PageHero
        title="Үйлчилгээ"
        breadcrumb={[{ label: "Үйлчилгээ" }]}
        description="Төмөр замын ачаа тээвэр, хөдлөх бүрэлдэхүүний түрээс, зүтгүүрийн засвар, зөвлөх үйлчилгээ. Тээвэрлэлт, засвар үйлчилгээ, тээвэр зуучлалын тусгай зөвшөөрөлтэй."
      >
        <div className="flex flex-wrap gap-2 pt-2">
          <Chip href="#order" primary>
            Тээврийн захиалга өгөх
          </Chip>
          <Chip href="#cargo">Ачаа тээвэр</Chip>
          <Chip href="#rent">Түрээс</Chip>
          <Chip href="#repair">Зүтгүүрийн засвар</Chip>
          <Chip href="#consult">Зөвлөх үйлчилгээ</Chip>
        </div>
      </PageHero>

      {/* 01 Ачаа тээвэр */}
      <Section id="cargo" padding="pt-24 pb-12">
        <Container>
          <Split>
            <SplitMedia placeholder="ачааны галт тэрэг" />
            <SplitText pill="01" title="Төмөр замын ачаа тээвэр">
              <p>“МТЗ” ТӨХК болон “МТЛ” ХХК-тай хамтран зүтгүүр түрээслүүлж, тээврийн үйл ажиллагаа эрхэлдэг.</p>
              <div className="text-sm font-bold">Тээврийн чиглэлүүд</div>
              <RouteChips routes={["Тавантолгой – Гашуунсухайт", "Тавантолгой – Зүүнбаян", "Тавантолгой – Ханги"]} />
              <Stats
                size="md"
                items={[
                  { value: "3 сая тн", label: "ТТ–ГС чиглэл, 2023–2024" },
                  { value: "1.5 сая тн", label: "ТТ–Зүүнбаян чиглэл, 2024" },
                ]}
              />
              <ButtonLink href="#order" className="self-start">
                Тээврийн захиалга өгөх
              </ButtonLink>
            </SplitText>
          </Split>
        </Container>
      </Section>

      {/* Тээврийн захиалга */}
      <Section id="order" padding="py-12">
        <Container>
          <FormSection boxed>
            <FormIntro
              pill="Захиалга"
              title="Тээврийн захиалга өгөх"
              description="Ачааныхаа мэдээллийг бөглөж илгээхэд манай мэргэжилтэн тээврийн нөхцөл, үнийн саналыг [хугацаа] дотор хүргүүлнэ."
            >
              <StepList
                items={[
                  { title: "Захиалга илгээх", text: "Маршрут, ачааны төрөл, хэмжээгээ бөглөнө." },
                  { title: "Үнийн санал, гэрээ", text: "Тээврийн нөхцөл, үнийг тохирч гэрээ байгуулна." },
                  { title: "Ачилт, тээвэрлэлт", text: "Тохирсон хугацаанд ачааг ачиж, хүргэнэ." },
                ]}
              />
              <ContactBox phoneLabel="Утсаар захиалах" showEmail={false} />
            </FormIntro>

            <InquiryForm kind="order" submitLabel="Захиалга илгээх">
              <FormFieldset legend="1. Маршрут">
                <div className="flex flex-wrap items-end gap-3">
                  <TextField
                    label="Хаанаас (ачих өртөө)"
                    name="from"
                    placeholder="Жишээ: Тавантолгой"
                    required
                    className="min-w-0 flex-[1_1_220px]"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-12 flex-none items-center justify-center rounded-full bg-sky text-xl text-blue-dark"
                  >
                    →
                  </span>
                  <TextField
                    label="Хаашаа (буулгах өртөө)"
                    name="to"
                    placeholder="Жишээ: Гашуунсухайт"
                    required
                    className="min-w-0 flex-[1_1_220px]"
                  />
                </div>
              </FormFieldset>

              <FormFieldset legend="2. Ачааны мэдээлэл">
                <FormGrid>
                  <SelectField
                    label="Ачааны төрөл"
                    name="cargo_type"
                    options={["Нүүрс", "Хүдэр, баяжмал", "Барилгын материал", "Чингэлэгтэй ачаа", "Бусад"]}
                  />
                  <UnitField label="Ачааны хэмжээ" name="tonnes" unit="тонн" min={0} placeholder="0" required />
                  <SelectField
                    label="Вагоны төрөл"
                    name="wagon_type"
                    options={["Тавцант вагон", "Хагас вагон", "Чингэлэг", "Мэдэхгүй, зөвлөгөө хэрэгтэй"]}
                  />
                  <TextField label="Ачих огноо" name="date" type="date" />
                  <SelectField
                    label="Тээврийн давтамж"
                    name="frequency"
                    options={["Нэг удаагийн", "Сар бүр", "Тогтмол (урт хугацааны гэрээ)"]}
                  />
                </FormGrid>
              </FormFieldset>

              <FormFieldset legend="3. Холбоо барих">
                <FormGrid>
                  <TextField label="Овог, нэр" name="name" required autoComplete="name" />
                  <TextField label="Байгууллагын нэр" name="company" autoComplete="organization" />
                  <TextField label="Утас" name="phone" type="tel" required autoComplete="tel" />
                  <TextField label="И-мэйл" name="email" type="email" autoComplete="email" />
                </FormGrid>
              </FormFieldset>

              <TextareaField label="Нэмэлт мэдээлэл (ачааны онцлог, савлагаа гэх мэт)" name="message" rows={3} />
            </InquiryForm>
          </FormSection>
        </Container>
      </Section>

      {/* 02 Түрээс */}
      <Section id="rent" padding="py-12">
        <Container>
          <SectionHead
            pill="02"
            title="Хөдлөх бүрэлдэхүүний түрээс"
            description="Гол замын 4 зүтгүүр, 200 тавцант вагон, чингэлэг өргөгч түрээслүүлнэ. Харилцагчийн хүсэлтээр бүх төрлийн хөдлөх бүрэлдэхүүнийг түрээслүүлэх боломжтой."
            action={<ButtonLink href="#request">Түрээсийн хүсэлт илгээх</ButtonLink>}
            className="mb-8"
          />
          <AutoGrid min={260}>
            {rentals.map((item) => (
              <Card
                key={item.title}
                variant="bordered"
                compact
                media={<ImagePlaceholder label={item.placeholder} className="h-[180px]" />}
              >
                <Tag>{item.tag}</Tag>
                <CardTitle compact>{item.title}</CardTitle>
                <CardText>
                  {item.meta[0]}
                  <br />
                  {item.meta[1]}
                </CardText>
              </Card>
            ))}
            <Card
              variant="dashed"
              compact
              media={
                <div className="flex h-[180px] items-center justify-center font-semibold text-blue-dark">＋ Хүсэлтээр</div>
              }
            >
              <Tag>Бусад</Tag>
              <CardTitle compact>Бусад хөдлөх бүрэлдэхүүн</CardTitle>
              <CardText>Харилцагчийн хүсэлтээр бүх төрлийн зүтгүүр, вагоныг түрээслүүлнэ.</CardText>
            </Card>
          </AutoGrid>
        </Container>
      </Section>

      {/* 03 Зүтгүүрийн засвар */}
      <Section id="repair" padding="py-12">
        <Container>
          <Split reverse>
            <SplitText pill="03" title="ТЭ33АС серийн зүтгүүрийн засвар үйлчилгээ">
              <p>
                Evolution ТЭ33АС серийн гол замын зүтгүүрийн засвар үйлчилгээ. Засвар үйлчилгээний тусгай зөвшөөрөлтэй,
                өөрийн сэлбэг материалын агуулахтай.
              </p>
              <Checklist
                items={[
                  "[Засварын төрөл 1: жишээ нь урсгал засвар]",
                  "[Засварын төрөл 2: жишээ нь техникийн үйлчилгээ]",
                  "Сэлбэг материалын нийлүүлэлт",
                ]}
              />
              <ButtonLink href="#request" className="self-start">
                Засварын хүсэлт илгээх
              </ButtonLink>
            </SplitText>
            <SplitMedia placeholder="ТЭ33АС зүтгүүрийн засвар" />
          </Split>
        </Container>
      </Section>

      {/* 04 Зөвлөх үйлчилгээ */}
      <Section id="consult" padding="pt-12 pb-24">
        <Container>
          <Split>
            <SplitMedia placeholder="мэргэжилтнүүд, төлөвлөлт" />
            <SplitText pill="04" title="Ачаа тээврийн зөвлөх үйлчилгээ">
              <p>Төмөр замын ачаа тээврийг төлөвлөх, зардал тооцоолох, зохион байгуулахад мэргэжлийн зөвлөгөө өгнө.</p>
              <Checklist
                items={[
                  "Тээвэр логистикийн тооцоолол",
                  "Тээврийн чиглэл, хөдлөх бүрэлдэхүүний сонголт",
                  "[Нэмэлт зөвлөгөөний чиглэл]",
                ]}
              />
              <ButtonLink href="#request" className="self-start">
                Зөвлөгөө авах
              </ButtonLink>
            </SplitText>
          </Split>
        </Container>
      </Section>

      {/* Нэмэлт үйлчилгээ */}
      <Section tone="dark" padding="py-24">
        <Container>
          <SectionHead onDark pill="Нэмэлт үйлчилгээ" title="Бусад үйлчилгээ" />
          <AutoGrid min={380}>
            <DarkCard title="Төмөр замын ачилт, буулгалт">
              <ul className="list-disc pl-[18px]">
                <li>ТТӨ-ний 28 вагоны хүчин чадалтай 24-р салбар замыг эзэмшдэг.</li>
                <li>“Инкон” ХХК-ийн 14 вагоны хүчин чадалтай салбар замыг гэрээгээр хамтран ашигладаг.</li>
              </ul>
            </DarkCard>
            <DarkCard title="Тээвэр зууч, гаалийн зууч">
              <p>Тээвэр зуучлалын тусгай зөвшөөрөлтэйгөөр ачааг гаалийн бүрдүүлэлттэй нь зуучилна.</p>
            </DarkCard>
          </AutoGrid>
        </Container>
      </Section>

      {/* Түрээс, бусад үйлчилгээний хүсэлт */}
      <Section id="request" tone="soft" padding="py-24">
        <Container>
          <FormSection>
            <FormIntro
              pill="Хүсэлт"
              title="Түрээс, бусад үйлчилгээний хүсэлт"
              description="Мэдээллээ үлдээвэл манай мэргэжилтэн [хугацаа] дотор холбогдоно."
            >
              <ContactBox />
            </FormIntro>
            <InquiryForm kind="service" submitLabel="Илгээх">
              <FormGrid>
                <TextField label="Овог, нэр" name="name" required autoComplete="name" />
                <TextField label="Байгууллагын нэр" name="company" autoComplete="organization" />
                <TextField label="Утас" name="phone" type="tel" required autoComplete="tel" />
                <TextField label="И-мэйл" name="email" type="email" autoComplete="email" />
                <SelectField label="Үйлчилгээ" name="service" options={serviceOptions} full />
                <TextareaField
                  label="Хүсэлтийн дэлгэрэнгүй (түрээсийн тоо ширхэг, хугацаа гэх мэт)"
                  name="message"
                  full
                />
              </FormGrid>
            </InquiryForm>
          </FormSection>
        </Container>
      </Section>
    </>
  );
}
