"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "./product-grid";
import { CatalogFilters, SORT_OPTIONS, type CatalogFilterState, type SortOption } from "./catalog-filters";
import type { Brand, CategorySlug, Product } from "@/lib/types";

const PAGE_SIZE = 12;
const SIZE_ORDER = ["PP", "P", "M", "G", "GG", "EXG", "Único"];

type CatalogViewProps = {
  products: Product[];
  brands?: Brand[];
  fixedCategory?: CategorySlug;
  initialFilter?: "novidades" | "mais-vendidos";
  initialSubcategory?: string;
  hideBrandFilter?: boolean;
};

function parseListParam(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

/** Reads filter state from the URL so a filtered view is shareable/bookmarkable and survives back-navigation. Falls back to the page's own defaults (legacy `?filtro=` links, `?sub=` deep links) when a param is absent. */
function stateFromSearchParams(
  params: URLSearchParams,
  initialFilter?: "novidades" | "mais-vendidos",
  initialSubcategory?: string,
): CatalogFilterState {
  const legacyFiltro = params.get("filtro");
  return {
    categories: parseListParam(params.get("categoria")) as CategorySlug[],
    brandSlugs: parseListParam(params.get("marca")),
    subcategory: params.get("sub") ?? initialSubcategory ?? null,
    colors: parseListParam(params.get("cor")),
    sizes: parseListParam(params.get("tam")),
    minPrice: params.get("precoMin") ? Number(params.get("precoMin")) : null,
    maxPrice: params.get("precoMax") ? Number(params.get("precoMax")) : null,
    sort: (params.get("ordenar") as SortOption | null) ?? "relevancia",
    onlyNew: params.get("novo") === "1" || legacyFiltro === "novidades" || initialFilter === "novidades",
    onlyBestSellers:
      params.get("vendidos") === "1" || legacyFiltro === "mais-vendidos" || initialFilter === "mais-vendidos",
  };
}

function stateToSearchParams(state: CatalogFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.categories.length > 0) params.set("categoria", state.categories.join(","));
  if (state.brandSlugs.length > 0) params.set("marca", state.brandSlugs.join(","));
  if (state.subcategory) params.set("sub", state.subcategory);
  if (state.colors.length > 0) params.set("cor", state.colors.join(","));
  if (state.sizes.length > 0) params.set("tam", state.sizes.join(","));
  if (state.minPrice !== null) params.set("precoMin", String(state.minPrice));
  if (state.maxPrice !== null) params.set("precoMax", String(state.maxPrice));
  if (state.sort !== "relevancia") params.set("ordenar", state.sort);
  if (state.onlyNew) params.set("novo", "1");
  if (state.onlyBestSellers) params.set("vendidos", "1");
  return params;
}

function CatalogViewInner({
  products,
  brands = [],
  fixedCategory,
  initialFilter,
  initialSubcategory,
  hideBrandFilter,
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setStateRaw] = useState<CatalogFilterState>(() =>
    stateFromSearchParams(searchParams, initialFilter, initialSubcategory),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const setState = useCallback(
    (next: CatalogFilterState) => {
      setStateRaw(next);
      const qs = stateToSearchParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const [page, setPage] = useState(1);
  // Reset to page 1 whenever filters change, without an effect: `state` is a
  // fresh object every time CatalogFilters calls onChange, so a reference
  // change here reliably means "filters changed", adjusting state during
  // render (React's recommended pattern) avoids the extra render pass an
  // effect-based reset would cause.
  const [filterKey, setFilterKey] = useState(state);
  if (filterKey !== state) {
    setFilterKey(state);
    setPage(1);
  }

  useEffect(() => {
    document.documentElement.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const scope = fixedCategory ? products.filter((p) => p.category === fixedCategory) : products;

  const subcategories = useMemo(
    () => Array.from(new Set(scope.map((p) => p.subcategory))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [scope],
  );

  const colors = useMemo(() => {
    const map = new Map<string, string>();
    scope.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map, ([name, hex]) => ({ name, hex }));
  }, [scope]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    scope.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a);
      const bi = SIZE_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b, "pt-BR");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [scope]);

  const priceBounds = useMemo(() => {
    if (scope.length === 0) return { min: 0, max: 0 };
    const prices = scope.map((p) => p.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [scope]);

  const filtered = useMemo(() => {
    let list = scope;

    if (state.categories.length > 0) {
      list = list.filter((p) => state.categories.includes(p.category));
    }
    if (state.subcategory) {
      list = list.filter((p) => p.subcategory === state.subcategory);
    }
    if (state.brandSlugs.length > 0) {
      list = list.filter((p) => state.brandSlugs.includes(p.brandSlug));
    }
    if (state.colors.length > 0) {
      list = list.filter((p) => p.colors.some((c) => state.colors.includes(c.name)));
    }
    if (state.sizes.length > 0) {
      list = list.filter((p) => p.sizes.some((s) => state.sizes.includes(s)));
    }
    if (state.minPrice !== null) list = list.filter((p) => p.price >= state.minPrice!);
    if (state.maxPrice !== null) list = list.filter((p) => p.price <= state.maxPrice!);
    if (state.onlyNew) list = list.filter((p) => p.isNew);
    if (state.onlyBestSellers) list = list.filter((p) => p.isBestSeller);

    const sorted = [...list];
    switch (state.sort) {
      case "menor-preco":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "maior-preco":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "recentes":
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "vendidos":
        sorted.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
      default:
        break;
    }
    return sorted;
  }, [scope, state]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filtersProps = {
    state,
    onChange: setState,
    brands,
    subcategories,
    colors,
    sizes,
    priceBounds,
    hideCategoryFilter: Boolean(fixedCategory),
    hideBrandFilter,
  };

  const activeFilterCount =
    state.categories.length +
    state.brandSlugs.length +
    (state.subcategory ? 1 : 0) +
    state.colors.length +
    state.sizes.length +
    (state.minPrice !== null ? 1 : 0) +
    (state.maxPrice !== null ? 1 : 0) +
    (state.onlyNew ? 1 : 0) +
    (state.onlyBestSellers ? 1 : 0);

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-10">
      <aside className="hidden lg:sticky lg:top-28 lg:block">
        <CatalogFilters {...filtersProps} />
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-mist pb-4">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="label-caps flex items-center gap-2 border border-mist px-4 py-2.5 text-[11px] text-ink transition-colors hover:border-ink lg:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-paper">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="hidden text-xs text-graphite lg:block">{filtered.length} produtos</p>

          <label className="ml-auto flex items-center gap-2 text-xs text-graphite lg:ml-0">
            <span className="label-caps hidden text-[11px] sm:inline">Ordenar por</span>
            <select
              value={state.sort}
              onChange={(e) => setState({ ...state, sort: e.target.value as SortOption })}
              className="border border-mist bg-paper px-2 py-1.5 text-xs text-ink"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mb-4 text-xs text-graphite lg:hidden">{filtered.length} produtos</p>

        <ProductGrid products={pageItems} />

        {totalPages > 1 && (
          <nav aria-label="Paginação" className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="label-caps border border-mist px-3 py-2 text-[11px] text-graphite transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
              aria-label="Página anterior"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={page === n}
                className={`label-caps flex h-9 w-9 items-center justify-center border text-[11px] transition-colors ${
                  page === n ? "border-ink bg-ink text-paper" : "border-mist text-graphite hover:border-ink hover:text-ink"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="label-caps border border-mist px-3 py-2 text-[11px] text-graphite transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
              aria-label="Próxima página"
            >
              ›
            </button>
          </nav>
        )}
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity duration-300 lg:hidden ${
          mobileFiltersOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileFiltersOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-xs flex-col bg-paper shadow-xl transition-transform duration-300 lg:hidden ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Filtros"
      >
        <div className="flex items-center justify-between border-b border-mist p-5">
          <p className="font-display text-lg">Filtros</p>
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setMobileFiltersOpen(false)}
            className="-m-2 p-2 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <CatalogFilters {...filtersProps} />
        </div>
        <div className="border-t border-mist p-5">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="label-caps w-full bg-ink py-3.5 text-xs text-paper transition-colors hover:bg-petrol"
          >
            Ver {filtered.length} produtos
          </button>
        </div>
      </div>
    </div>
  );
}

export function CatalogView(props: CatalogViewProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-graphite">Carregando filtros...</div>}>
      <CatalogViewInner {...props} />
    </Suspense>
  );
}
