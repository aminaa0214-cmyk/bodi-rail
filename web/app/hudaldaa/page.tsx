import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardText, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { LogoGrid } from "@/components/sections/PartnerLogos";
import { SplitText } from "@/components/sections/Split";
import { Steps } from "@/components/sections/Steps";
import { ContactBox, FormIntro, FormSection } from "@/components/forms/FormSection";
import { FormGrid, SelectField, TextareaField, TextField } from "@/components/forms/Field";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { foreignPartners } from "@/content/partners";
import { getOfferings } from "@/lib/data";

const DESCRIPTION = "Бүх төрлийн зүтгүүр, вагон болон сэлбэг нийлүүлнэ.";

export const metadata: Metadata = {
  title: "Худалдаа",
  description: DESCRIPTION,
};

const steps = [
  { title: "Хүсэлт илгээх", text: "Хэрэгцээт бүтээгдэхүүн, тоо хэмжээгээ илгээнэ." },
  { title: "Үнийн санал", text: "Бид үнэ, нийлүүлэх хугацааны саналаа хүргүүлнэ." },
  { title: "Гэрээ байгуулах", text: "Нөхцөлөө тохирч нийлүүлэлтийн гэрээ байгуулна." },
  { title: "Нийлүүлэлт", text: "Бүтээгдэхүүнийг тохирсон хугацаанд хүлээлгэн өгнө." },
];

export default async function HudaldaaPage() {
  // Бүтээгдэхүүний картууд: Supabase → offerings (section = sale)
  const products = await getOfferings("sale");

  return (
    <>
      <PageHero title="Худалдаа" breadcrumb={[{ label: "Худалдаа" }]} description={DESCRIPTION} />

      {/* Бүтээгдэхүүн */}
      <Section padding="pt-[72px] pb-24 md:pt-28">
        <Container>
          <SectionHead pill="Бүтээгдэхүүн" title="Нийлүүлдэг хөдлөх бүрэлдэхүүн" />
          <AutoGrid>
            {products.map((product) => (
              <Card
                key={product.id}
                variant="bordered"
                media={
                  product.image ? (
                    <div className="relative h-60">
                      <Image
                        src={product.image.src}
                        alt={product.image.alt}
                        fill
                        sizes="(max-width: 900px) 100vw, 420px"
                        className="object-cover"
                        style={product.image.position ? { objectPosition: product.image.position } : undefined}
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder label={product.placeholder} className="h-60" />
                  )
                }
              >
                <CardTitle>{product.title}</CardTitle>
                <CardText>
                  {product.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {product.details.length > 0 && (
                    <ul className="list-disc pl-[18px]">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </CardText>
                <ButtonLink href="#quote" className="mt-auto self-start">
                  Үнийн санал авах
                </ButtonLink>
              </Card>
            ))}
          </AutoGrid>
        </Container>
      </Section>

      {/* Худалдан авалтын алхмууд */}
      <Section tone="soft" padding="py-24">
        <Container>
          <SectionHead align="center" pill="Хэрхэн худалдан авах вэ" title="Худалдан авалтын алхмууд" />
          <Steps items={steps} />
        </Container>
      </Section>

      {/* Гадаад хамтрагчид */}
      <Section padding="pt-24">
        <Container className="flex flex-wrap items-center gap-14">
          <SplitText title="Гадаад хамтрагч, түншүүд" className="min-w-0 flex-[1_1_360px] [&>h2]:text-[32px]">
            <p>Дэлхийн тэргүүлэх зүтгүүр, вагон үйлдвэрлэгчидтэй хамтран ажилладаг.</p>
          </SplitText>
          <LogoGrid partners={foreignPartners} className="min-w-0 flex-[2_1_560px]" />
        </Container>
      </Section>

      {/* Үнийн санал авах маягт */}
      <Section id="quote" padding="py-24">
        <Container>
          <FormSection boxed>
            <FormIntro
              pill="Хүсэлт"
              title="Үнийн санал авах"
              description="Мэдээллээ үлдээвэл манай мэргэжилтэн [хугацаа] дотор холбогдоно."
            >
              <ContactBox />
            </FormIntro>
            <InquiryForm kind="quote" submitLabel="Илгээх">
              <FormGrid>
                <TextField label="Овог, нэр" name="name" required autoComplete="name" />
                <TextField label="Байгууллагын нэр" name="company" autoComplete="organization" />
                <TextField label="Утас" name="phone" type="tel" required autoComplete="tel" />
                <TextField label="И-мэйл" name="email" type="email" autoComplete="email" />
                <SelectField label="Бүтээгдэхүүн" name="product" options={products.map((p) => p.title)} />
                <TextField label="Загвар, тоо ширхэг" name="quantity" />
                <TextareaField label="Нэмэлт мэдээлэл" name="message" full />
              </FormGrid>
            </InquiryForm>
          </FormSection>
        </Container>
      </Section>
    </>
  );
}
