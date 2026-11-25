import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Rule";

/** Нүүр хуудасны том баннер */
export function Hero() {
  return (
    <section className="overflow-hidden bg-navy pb-24 text-white">
      <Container className="flex flex-wrap items-center gap-12 pt-24">
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          <h1 className="text-4xl leading-[1.1] font-extrabold uppercase md:text-[52px]">Тээвэр логистикийн компани</h1>
          <Rule />
          <p className="max-w-[560px] text-lg leading-[1.6] text-light">
            Төмөр замын ачаа тээвэр, зүтгүүр, вагон, сэлбэгийн нийлүүлэлт, хөдлөх бүрэлдэхүүний түрээс, ТЭ33АС серийн
            зүтгүүрийн засвар үйлчилгээ.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink href="#about" variant="outline-light" caps>
              Бидний тухай
            </ButtonLink>
            <ButtonLink href="#contact" caps>
              Холбоо барих
            </ButtonLink>
          </div>
        </div>
        <Image
          src="/images/te33ac-1002.webp"
          alt="Бодь Рэйлийн Evolution ТЭ33АС-1002 зүтгүүр ачааны галт тэргийг татаж буй нь"
          width={2000}
          height={1500}
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 900px) 100vw, 50vw"
          className="h-[300px] min-w-0 flex-[1_1_420px] rounded-[0_220px_0_220px] object-cover object-[70%_center] md:h-[460px]"
        />
      </Container>
    </section>
  );
}
