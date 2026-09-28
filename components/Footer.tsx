import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { footerHelpLinks, footerServiceLinks, legalLinks, activeSocials } from "@/data/footer";
import { getSocials } from "@/lib/catalog";

function FooterLink({ href, label }: { href: string; label: string }) {
  const className = "transition hover:text-brand";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

export async function Footer() {
  const currentYear = new Date().getFullYear();
  // Tautan sosmed diatur dari menu Pengaturan admin; yang kosong tidak ditampilkan.
  const socials = activeSocials(await getSocials());

  return (
    <footer className="border-t border-line bg-surface pt-12 pb-6">
      <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-[240px] text-[12px] text-muted">
            Solusi pembayaran tagihan yang cepat, aman, dan terpercaya untuk kebutuhan sehari-hari.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-bold">Layanan</p>
          <ul className="space-y-1.5 text-[12px] text-muted">
            {footerServiceLinks[0].map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-bold opacity-0 sm:opacity-100" aria-hidden="true">
            &nbsp;
          </p>
          <ul className="space-y-1.5 text-[12px] text-muted">
            {footerServiceLinks[1].map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </div>          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="mb-3 text-[13px] font-bold">Bantuan</p>
              <ul className="space-y-1.5 text-[12px] text-muted">
                {footerHelpLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>            {socials.length > 0 ? (
              <div>
                <p className="mb-3 text-[13px] font-bold">Ikuti Kami</p>
                <ul className="flex flex-wrap gap-2 text-muted">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        aria-label={social.label}
                        className="transition hover:text-brand"
                      >
                        <Icon name={social.icon} className="h-[18px] w-[18px]" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
      </div>

      <div className="wrap mt-10 flex flex-col justify-between gap-2 border-t border-line pt-5 text-[11px] text-muted sm:flex-row">
        <p>&copy; {currentYear} Aurevia Digital. Semua hak dilindungi.</p>
        <div className="flex gap-5">
          {legalLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-brand">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
