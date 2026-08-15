import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { getSubcategoriesByCategory } from "@/lib/demo-data";
import type { CategoryMenu } from "@/components/header";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Fluxo FLX é uma curadoria multimarcas de moda lifestyle que conecta treino, praia e cidade. Vista o movimento.",
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/busca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const CATEGORY_LABELS: { slug: "fitness" | "surf" | "casual"; label: string; href: string }[] = [
  { slug: "fitness", label: "Fitness", href: "/fitness" },
  { slug: "surf", label: "Surf", href: "/surf" },
  { slug: "casual", label: "Casual", href: "/casual" },
];

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const categoryMenus: CategoryMenu[] = await Promise.all(
    CATEGORY_LABELS.map(async (cat) => ({
      ...cat,
      subcategories: await getSubcategoriesByCategory(cat.slug),
    })),
  );

  return (
    <CartProvider>
      <WishlistProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
        <div className="flex min-h-full flex-col">
          <AnnouncementBar />
          <Header categoryMenus={categoryMenus} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <WhatsAppFloatButton />
      </WishlistProvider>
    </CartProvider>
  );
}
