import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Хуудас олдсонгүй"
        breadcrumb={[{ label: "404" }]}
        description="Таны хайсан хуудас устсан эсвэл хаяг нь өөрчлөгдсөн байж магадгүй."
      />
      <Section>
        <Container>
          <ButtonLink href="/">Нүүр хуудас руу буцах</ButtonLink>
        </Container>
      </Section>
    </>
  );
}
