import Link from "next/link";
import { contact, footerNav, site, social } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Brand } from "./Brand";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-navy-2 pt-20 pb-8 text-white">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap gap-12">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <Brand light />
            <p className="text-sm leading-[1.7] text-light">{site.about}</p>
            <div className="flex flex-wrap gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/6 text-xs font-bold text-white no-underline hover:text-white"
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="flex flex-[1_1_160px] flex-col gap-1">
              <div className="pb-2 text-sm font-bold">{col.title}</div>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className="py-1.5 text-sm text-light no-underline hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-[1_1_260px] flex-col gap-3.5">
            <div className="pb-2 text-sm font-bold">Холбоо барих</div>
            <ContactItem label="Утас">
              <a href={contact.phone.href} className="text-inherit hover:text-white">
                {contact.phone.display}
              </a>
            </ContactItem>
            <ContactItem label="И-мэйл">
              <a href={`mailto:${contact.email}`} className="text-inherit hover:text-white">
                {contact.email}
              </a>
            </ContactItem>
            <ContactItem label="Хаяг">{contact.address}</ContactItem>
            <ContactItem label="Цагийн хуваарь">{contact.hours}</ContactItem>
          </div>
        </div>

        <div className="relative h-[280px] overflow-hidden rounded-2xl bg-[#1b3358]">
          <iframe
            src={contact.map.embed}
            title={contact.map.title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block size-full border-0"
          />
          <a
            href={contact.map.link}
            target="_blank"
            rel="noopener"
            className="absolute right-3 bottom-3 inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-navy no-underline shadow-[0_2px_8px_rgba(0,0,0,.2)]"
          >
            Google Maps дээр нээх ↗
          </a>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-[13px] text-[#a9bcd4]">
          <span>© {new Date().getFullYear()} {site.name}. Бүх эрх хуулиар хамгаалагдсан.</span>
        </div>
      </Container>
    </footer>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-sm leading-[1.6] text-light">
      <b className="font-semibold text-white">{label}:</b> {children}
    </div>
  );
}
