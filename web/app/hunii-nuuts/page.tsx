import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { BenefitCard } from "@/components/sections/BenefitCard";
import { JobCard } from "@/components/sections/JobCard";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { benefits, jobs } from "@/content/jobs";

export const metadata: Metadata = {
  title: "Хүний нөөц",
  description: "Бодь Рэйл ХХК-ийн нээлттэй ажлын байр. Анкетаа онлайнаар бөглөж илгээнэ үү.",
};

export default function HuniiNuutsPage() {
  return (
    <>
      <PageHero
        title="Хүний нөөц"
        breadcrumb={[{ label: "Хүний нөөц" }]}
        description="Бодь Рэйлийн багт нэгдэж, төмөр замын салбарт карьераа хөгжүүлээрэй. Нээлттэй ажлын байрнаас сонгоод анкетаа онлайнаар бөглөж илгээнэ үү."
      >
        <div className="flex flex-wrap gap-2 pt-2">
          <Chip href="#apply" primary>
            Анкет бөглөх
          </Chip>
          <Chip href="#jobs">Нээлттэй ажлын байр</Chip>
        </div>
      </PageHero>

      {/* Нээлттэй ажлын байр */}
      <Section id="jobs" padding="py-24">
        <Container>
          <SectionHead pill="Нээлттэй ажлын байр" title="Бид дараах ажлын байранд ажилтан хайж байна" />
          <AutoGrid min={260} className="items-start">
            {jobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </AutoGrid>
        </Container>
      </Section>

      {/* Бид санал болгоно */}
      <Section id="benefits" tone="dark" padding="py-24">
        <Container>
          <SectionHead onDark pill="Бид санал болгоно" title="Бодь Рэйлд ажиллахын давуу тал" />
          <AutoGrid min={260}>
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} benefit={benefit} />
            ))}
          </AutoGrid>
        </Container>
      </Section>

      {/* Онлайн анкет */}
      <Section id="apply" tone="soft" padding="py-24">
        <Container>
          <SectionHead
            pill="Анкет"
            title="Онлайн анкет бөглөх"
            description={
              <>
                Бүрэн гүйцэт, үнэн зөв бөглөнө үү. <span className="text-[#c62828]">*</span> тэмдэглэсэн талбарыг заавал
                бөглөнө. Таны регистрийн дугаараар бүртгэл хийгдэх тул үнэн зөв эсэхийг дахин нягтална уу.
              </>
            }
          />
          <ApplicationForm />
        </Container>
      </Section>
    </>
  );
}
