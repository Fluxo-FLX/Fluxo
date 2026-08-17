import Link from "next/link";
import { FlowLines } from "./flow-lines";
import { NewsletterForm } from "./newsletter-form";
import { PaymentIcons } from "./payment-icons";
import { SecurityBadge } from "./security-badge";
import { getWhatsAppLink } from "@/lib/site-config";
import { getSettings } from "@/server/repositories/settings-repository";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Compre",
    links: [
      { href: "/loja?filtro=novidades", label: "Novidades" },
      { href: "/fitness", label: "Fitness" },
      { href: "/surf", label: "Surf" },
      { href: "/street", label: "Street" },
      { href: "/loja?filtro=mais-vendidos", label: "Mais vendidos" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { href: "/contato", label: "Contato" },
      { href: "/faq", label: "FAQ" },
      { href: "/trocas-e-devolucoes", label: "Trocas" },
      { href: "/trocas-e-devolucoes", label: "Devoluções" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre a Fluxo" },
      { href: "/manifesto", label: "Manifesto" },
      { href: "/privacidade", label: "Privacidade" },
      { href: "/termos", label: "Termos" },
    ],
  },
];

export async function Footer() {
  const { whatsappNumber } = await getSettings();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <FlowLines className="flow-lines-bg absolute inset-x-0 bottom-0 h-2/3 w-full" variant="light" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 border-b border-paper/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <img src="/logo-light.png?v=2" alt="Fluxo FLX" className="h-5 w-auto sm:h-6" />
            <p className="label-caps mt-3 text-xs text-paper/60">Seu ritmo. Seu estilo.</p>
          </div>
          <div>
            <p className="label-caps mb-3 text-xs text-paper/60">Entre no fluxo</p>
            <NewsletterForm dark />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="label-caps mb-4 text-xs text-paper/60">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-paper/85 transition-colors hover:text-sand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="label-caps mb-4 text-xs text-paper/60">Redes</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper/85 transition-colors hover:text-sand"
                >
                  WhatsApp
                </a>
              </li>
              {["Instagram", "TikTok"].map((social) => (
                <li key={social}>
                  <span className="text-sm text-paper/85">{social}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fluxo FLX. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-5">
            <SecurityBadge />
            <PaymentIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
