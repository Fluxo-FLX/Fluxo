"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { HeaderSearch } from "./header-search";

export type CategoryMenu = { slug: string; label: string; href: string; subcategories: string[] };

type DropdownItem = { label: string; href: string };

function DesktopDropdown({
  label,
  href,
  items,
  viewAllHref,
  viewAllLabel,
}: {
  label: string;
  href: string;
  items: DropdownItem[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="label-caps flex items-center gap-1 text-xs text-ink transition-colors hover:text-petrol"
      >
        {label}
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="transition-transform duration-200 group-hover:rotate-180"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>

      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-64 border border-mist bg-paper p-2 shadow-lg">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2.5 text-sm text-ink transition-colors hover:bg-mist/50 hover:text-petrol"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={viewAllHref}
            className="label-caps mt-1 block border-t border-mist px-3 pt-3 pb-1.5 text-[11px] text-petrol hover:underline"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileAccordion({
  label,
  items,
  viewAllHref,
  viewAllLabel,
  open,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: DropdownItem[];
  viewAllHref: string;
  viewAllLabel: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-mist">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="label-caps flex w-full items-center justify-between py-4 text-sm"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="pb-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="block py-2.5 pl-4 text-sm text-graphite transition-colors hover:text-petrol"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href={viewAllHref} onClick={onNavigate} className="label-caps block py-2.5 pl-4 text-[11px] text-petrol">
              {viewAllLabel}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export function Header({ categoryMenus }: { categoryMenus: CategoryMenu[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const { itemCount, openCart } = useCart();
  const { slugs } = useWishlist();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAccordion(null);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-mist bg-paper/95 py-2.5 backdrop-blur-sm"
          : "border-transparent bg-paper py-5"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2 p-2 text-ink lg:hidden"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shrink-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0"
        >
          <img src="/logo.png?v=2" alt="Fluxo FLX" className="h-6 w-auto sm:h-7" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/loja" className="label-caps text-xs text-ink transition-colors hover:text-petrol">
            Loja
          </Link>

          {categoryMenus.map((cat) => (
            <DesktopDropdown
              key={cat.slug}
              label={cat.label}
              href={cat.href}
              items={cat.subcategories.map((sub) => ({ label: sub, href: `${cat.href}?sub=${encodeURIComponent(sub)}` }))}
              viewAllHref={cat.href}
              viewAllLabel={`Ver tudo em ${cat.label}`}
            />
          ))}

          <Link
            href="/loja?filtro=novidades"
            className="label-caps text-xs text-ink transition-colors hover:text-petrol"
          >
            Novidades
          </Link>
        </nav>

        <div className="flex items-center gap-4 sm:gap-2">
          <HeaderSearch />
          <Link
            href={session ? "/conta" : "/login"}
            aria-label={session ? "Minha conta" : "Entrar"}
            className="-m-2 p-2 text-ink transition-colors hover:text-petrol"
          >
            {session ? (
              <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                {session.user?.name?.[0]?.toUpperCase() ?? "F"}
              </span>
            ) : (
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
              </svg>
            )}
          </Link>
          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="relative -m-2 p-2 text-ink transition-colors hover:text-petrol"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.2c-.3 0-.6-.1-.8-.3-1.9-1.5-3.7-2.9-5.2-4.4C3.7 13.2 2 11 2 8.5 2 6 4 4 6.5 4c1.6 0 3 .8 3.9 2 .1.2.4.2.5 0 .9-1.2 2.3-2 3.9-2C17.3 4 19.5 6 19.5 8.5c0 2.5-1.7 4.7-3.9 6.9-1.5 1.5-3.3 2.9-5.2 4.4-.2.2-.5.3-.8.3Z" />
            </svg>
            {slugs.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-petrol text-[10px] text-paper">
                {slugs.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir carrinho"
            className="relative -m-2 p-2 text-ink transition-colors hover:text-petrol"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l1.5 12h-15z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-paper shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-mist px-4 py-5">
          <img src="/logo.png?v=2" alt="Fluxo FLX" className="h-6 w-auto" />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={closeMobile}
            className="-m-2 p-2 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col px-4 py-4">
          <Link href="/loja" onClick={closeMobile} className="label-caps border-b border-mist py-4 text-sm">
            Loja
          </Link>

          {categoryMenus.map((cat) => (
            <MobileAccordion
              key={cat.slug}
              label={cat.label}
              items={cat.subcategories.map((sub) => ({ label: sub, href: `${cat.href}?sub=${encodeURIComponent(sub)}` }))}
              viewAllHref={cat.href}
              viewAllLabel={`Ver tudo em ${cat.label}`}
              open={mobileAccordion === cat.slug}
              onToggle={() => setMobileAccordion((v) => (v === cat.slug ? null : cat.slug))}
              onNavigate={closeMobile}
            />
          ))}

          <Link
            href="/loja?filtro=novidades"
            onClick={closeMobile}
            className="label-caps border-b border-mist py-4 text-sm"
          >
            Novidades
          </Link>
        </nav>
      </div>
    </header>
  );
}
