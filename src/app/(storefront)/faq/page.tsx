import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "FAQ",
};

const FAQ_ITEMS = [
  {
    title: "A Fluxo FLX fabrica as roupas que vende?",
    plainAnswer:
      "Não. A Fluxo FLX é uma curadoria multimarcas: selecionamos marcas parceiras de fitness, surf e casual e reunimos tudo em um só lugar.",
    content:
      "Não. A Fluxo FLX é uma curadoria multimarcas: selecionamos marcas parceiras de fitness, surf e casual e reunimos tudo em um só lugar.",
  },
  {
    title: "Quais formas de pagamento são aceitas?",
    plainAnswer: "PIX, cartão de crédito e boleto. No ambiente de demonstração, o pagamento é simulado (sandbox).",
    content: "PIX, cartão de crédito e boleto. No ambiente de demonstração, o pagamento é simulado (sandbox).",
  },
  {
    title: "Qual o prazo de entrega?",
    plainAnswer:
      "Entrega padrão: 5 a 8 dias úteis. Entrega expressa: 2 a 3 dias úteis. Compras acima do valor mínimo têm frete grátis na modalidade padrão.",
    content:
      "Entrega padrão: 5 a 8 dias úteis. Entrega expressa: 2 a 3 dias úteis. Compras acima do valor mínimo têm frete grátis na modalidade padrão.",
  },
  {
    title: "Como funcionam trocas e devoluções?",
    plainAnswer:
      "Você tem até 7 dias após o recebimento para solicitar troca ou devolução. Veja os detalhes na página de Trocas e devoluções.",
    content: (
      <>
        Você tem até 7 dias após o recebimento para solicitar troca ou devolução. Veja os detalhes em{" "}
        <Link href="/trocas-e-devolucoes" className="text-petrol hover:underline">
          Trocas e devoluções
        </Link>
        .
      </>
    ),
  },
  {
    title: "Preciso criar conta para comprar?",
    plainAnswer:
      "Não. Você pode finalizar a compra como convidado, informando apenas seu e-mail. Criar uma conta é opcional e permite acompanhar pedidos e salvar endereços com mais facilidade.",
    content:
      "Não. Você pode finalizar a compra como convidado, informando apenas seu e-mail. Criar uma conta é opcional e permite acompanhar pedidos e salvar endereços com mais facilidade.",
  },
  {
    title: "Como acompanho meu pedido?",
    plainAnswer: "Acesse Meus pedidos na sua conta ou use o número do pedido na página de Rastreamento.",
    content: (
      <>
        Acesse{" "}
        <Link href="/conta/pedidos" className="text-petrol hover:underline">
          Meus pedidos
        </Link>{" "}
        ou use o número do pedido em{" "}
        <Link href="/rastreamento" className="text-petrol hover:underline">
          Rastreamento
        </Link>
        .
      </>
    ),
  },
  {
    title: "Quero que minha marca faça parte da Fluxo FLX. Como faço?",
    plainAnswer: "Fale com a gente pela página de Contato. Todo cadastro de marca no site é feito pelo nosso time.",
    content: (
      <>
        Fale com a gente pela página de{" "}
        <Link href="/contato" className="text-petrol hover:underline">
          Contato
        </Link>
        . Todo cadastro de marca no site é feito pelo nosso time.
      </>
    ),
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.title,
    acceptedAnswer: { "@type": "Answer", text: item.plainAnswer },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "FAQ" }]} />
      <h1 className="font-display mb-10 text-3xl sm:text-4xl">Perguntas frequentes</h1>
      <Accordion items={FAQ_ITEMS} defaultOpenIndex={-1} />
    </div>
  );
}
