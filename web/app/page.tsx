import Image from "next/image";
import { Hero } from "@/components/layout/Hero";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardText, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stats } from "@/components/ui/Stats";
import { FleetCarousel } from "@/components/sections/FleetCarousel";
import { Licenses } from "@/components/sections/Licenses";
import { NewsCard } from "@/components/sections/NewsCard";
import { PartnerGroup } from "@/components/sections/PartnerLogos";
import { PromoCard } from "@/components/sections/PromoCard";
import { Split, SplitText } from "@/components/sections/Split";
import { Timeline } from "@/components/sections/Timeline";
import { fleet } from "@/content/fleet";
import { licenses } from "@/content/licenses";
import { news } from "@/content/news";
import { domesticPartners, foreignPartners } from "@/content/partners";
import { timeline } from "@/content/timeline";

const services = [
  {
    title: "Худалдаа",
    text: "Бүх төрлийн зүтгүүр, вагон болон сэлбэг нийлүүлнэ.",
    href: "/hudaldaa",
    image: { src: "/images/hudaldaa.jpg", alt: "Зүтгүүр, вагон, хөдлөх бүрэлдэхүүний сэлбэг" },
  },
  {
    title: "Түрээс",
    text: "Гол замын 4 зүтгүүр, 200 тавцант вагон, чингэлэг өргөгч түрээслүүлнэ. Харилцагчийн хүсэлтээр бүх төрлийн хөдлөх бүрэлдэхүүнийг түрээслүүлнэ.",
    href: "/uilchilgee#rent",
    image: { src: "/images/turees.jpg", alt: "Түрээсийн зүтгүүр, вагон, чингэлэг өргөгч" },
  },
  {
    title: "Үйлчилгээ",
    text: "Төмөр замын ачаа тээвэр, ТЭ33АС серийн зүтгүүрийн засвар үйлчилгээ, ачаа тээврийн зөвлөх үйлчилгээ.",
    href: "/uilchilgee",
    image: {
      src: "/images/uilchilgee.jpg",
      alt: "Төмөр замын тээвэр, зүтгүүрийн засвар, зөвлөх үйлчилгээ, гаалийн зууч",
    },
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Бидний тухай */}
      <Section id="about">
        <Container>
          <Split>
            <Image
              src="/images/bidnii-tuhai.jpg"
              alt="ТЭ33АС зүтгүүр нар жаргах үеэр говийн замаар ачаатай галт тэрэг татаж буй нь"
              width={1365}
              height={768}
              sizes="(max-width: 900px) 100vw, 50vw"
              className="block h-[420px] w-full rounded-3xl object-cover"
            />
            <SplitText pill="Бидний тухай" title="Бодь Рэйл ХХК">
              <p>
                “Бодь Рэйл” ХХК нь Бодь Группийн хэмжээнд төмөр замын тээвэртэй холбоотой бүх үйл ажиллагааг
                төвлөрүүлэн гүйцэтгэх зорилгоор 2024 оны 10 дугаар сард “Инкон” ХХК-ийн төмөр замын тээврийн хэлтсийг
                бие даалгах замаар байгуулагдсан.
              </p>
              <p>
                Бид төмөр замын тээвэрлэлт, засвар үйлчилгээ, тээвэр зуучлалын тусгай зөвшөөрөлтэйгөөр шинэ инновац,
                технологи нэвтрүүлэн төмөр замын тээврийг үр ашигтай зохион байгуулахыг зорьж ажилладаг.
              </p>
              <Stats
                items={[
                  { value: "4", label: "Гол замын зүтгүүр" },
                  { value: "200", label: "Тавцант вагон" },
                  { value: "100", label: "Хагас вагон" },
                  { value: "3 сая тн", label: "ТТ–ГС чиглэлд тээвэрлэсэн ачаа" },
                ]}
              />
              <ButtonLink href="#" variant="dark" className="self-start">
                Дэлгэрэнгүй →
              </ButtonLink>
            </SplitText>
          </Split>
        </Container>
      </Section>

      {/* Тусгай зөвшөөрөл */}
      <Section id="licenses" padding="pb-[72px] md:pb-28">
        <Container>
          <SectionHead
            pill="Тусгай зөвшөөрөл"
            title="Тусгай зөвшөөрөл, гэрчилгээ"
            description="Төмөр замын тээвэрлэлт, хөдлөх бүрэлдэхүүний засвар, тээвэр зуучлалын үйл ажиллагаа эрхлэх тусгай зөвшөөрөлтэй."
          />
          <Licenses items={licenses} />
        </Container>
      </Section>

      {/* Үйл ажиллагаа */}
      <Section tone="soft">
        <Container>
          <SectionHead
            align="center"
            pill="Үйл ажиллагаа"
            title="Бидний үйлчилгээ"
            description="Хөдлөх бүрэлдэхүүний нийлүүлэлт, түрээсээс эхлээд ачаа тээвэр, засвар үйлчилгээ хүртэл төмөр замын цогц үйлчилгээ"
          />
          <AutoGrid>
            {services.map((service) => (
              <Card
                key={service.title}
                media={
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    width={1408}
                    height={768}
                    sizes="(max-width: 900px) 100vw, 420px"
                    className="h-[220px] w-full bg-white object-contain"
                  />
                }
              >
                <CardTitle>{service.title}</CardTitle>
                <CardText>
                  <p>{service.text}</p>
                </CardText>
                <LinkArrow href={service.href}>Дэлгэрэнгүй</LinkArrow>
              </Card>
            ))}
          </AutoGrid>
        </Container>
      </Section>

      {/* Хүчин чадал */}
      <Section>
        <Container>
          <SectionHead
            align="center"
            pill="Хүчин чадал"
            title="Манай хөдлөх бүрэлдэхүүн"
            description="Слайд бүрт нэг төрөл: ТЭ33АС зүтгүүр, тавцант вагон, хагас вагон, Калмар чингэлэг өргөгч, салбар зам, сэлбэгийн агуулах"
          />
        </Container>
        <FleetCarousel slides={fleet} />
      </Section>

      {/* Бидний туршлага */}
      <Section tone="dark">
        <Container>
          <SectionHead align="center" onDark pill="Бидний туршлага" title="Хийж гүйцэтгэсэн ажлууд" />
          <Timeline items={timeline} />
        </Container>
      </Section>

      {/* Хамтрагчид */}
      <Section padding="pt-[72px] pb-16 md:pt-28">
        <Container>
          <SectionHead align="center" pill="Хамтрагчид" title="Хамтран ажилладаг байгууллагууд" />
          <div className="flex flex-wrap gap-8">
            <PartnerGroup label="Дотоод хамтрагч, түншүүд" partners={domesticPartners} />
            <PartnerGroup label="Гадаад хамтрагч, түншүүд" partners={foreignPartners} />
          </div>
        </Container>
      </Section>

      {/* Ажлын байр / Үнийн санал */}
      <Section padding="pb-[72px] md:pb-28">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-6">
          <PromoCard
            title="Нээлттэй ажлын байр"
            text="Бодь Рэйлийн багт нэгдэж, төмөр замын салбарт карьераа хөгжүүлээрэй."
            cta={{ label: "Ажлын байр үзэх", href: "/hunii-nuuts#jobs" }}
            image={{
              src: "/images/ajliin-bair.jpg",
              alt: "Төмөр замын хяналтын төвд ажиллаж буй ажилтнууд",
              width: 1365,
              height: 768,
              position: "78% center",
            }}
          />
          <PromoCard
            title="Үнийн санал авах"
            text="Худалдаа, түрээс, үйлчилгээний талаар хүсэлтээ илгээгээрэй."
            cta={{ label: "Хүсэлт илгээх", href: "/uilchilgee#request" }}
            image={{
              src: "/images/uniin-sanal.jpg",
              alt: "Харилцагчтай гар барьж буй Бодь Рэйлийн ажилтан",
              width: 1376,
              height: 768,
              position: "70% center",
            }}
          />
        </Container>
      </Section>

      {/* Мэдээ */}
      <Section id="news" tone="soft">
        <Container>
          <SectionHead pill="Мэдээ" title="Онцлох мэдээ" action={
              <LinkArrow href="#" className="self-auto">
                Бүгдийг үзэх
              </LinkArrow>
            } />
          <AutoGrid>
            {news.slice(0, 3).map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </AutoGrid>
        </Container>
      </Section>
    </>
  );
}
