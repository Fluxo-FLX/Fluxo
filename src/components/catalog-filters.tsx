"use client";

import type { Brand, CategorySlug } from "@/lib/types";

export type SortOption = "relevancia" | "recentes" | "vendidos" | "menor-preco" | "maior-preco";

export type CatalogFilterState = {
  categories: CategorySlug[];
  brandSlugs: string[];
  subcategory: string | null;
  colors: string[];
  sizes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortOption;
  onlyNew: boolean;
  onlyBestSellers: boolean;
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "recentes", label: "Mais recentes" },
  { value: "vendidos", label: "Mais vendidos" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

const ALL_CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "fitness", label: "Fitness" },
  { value: "surf", label: "Surf" },
  { value: "casual", label: "Casual" },
];

export function hasActiveFilters(state: CatalogFilterState): boolean {
  return (
    state.categories.length > 0 ||
    state.brandSlugs.length > 0 ||
    Boolean(state.subcategory) ||
    state.colors.length > 0 ||
    state.sizes.length > 0 ||
    state.minPrice !== null ||
    state.maxPrice !== null ||
    state.onlyNew ||
    state.onlyBestSellers
  );
}

type CatalogFiltersProps = {
  state: CatalogFilterState;
  onChange: (next: CatalogFilterState) => void;
  brands: Brand[];
  subcategories: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  priceBounds: { min: number; max: number };
  hideCategoryFilter?: boolean;
  hideBrandFilter?: boolean;
};

export function CatalogFilters({
  state,
  onChange,
  brands,
  subcategories,
  colors,
  sizes,
  priceBounds,
  hideCategoryFilter = false,
  hideBrandFilter = false,
}: CatalogFiltersProps) {
  const toggleCategory = (value: CategorySlug) => {
    const next = state.categories.includes(value)
      ? state.categories.filter((c) => c !== value)
      : [...state.categories, value];
    onChange({ ...state, categories: next });
  };

  const toggleBrand = (slug: string) => {
    const next = state.brandSlugs.includes(slug)
      ? state.brandSlugs.filter((b) => b !== slug)
      : [...state.brandSlugs, slug];
    onChange({ ...state, brandSlugs: next });
  };

  const toggleSubcategory = (value: string) => {
    onChange({ ...state, subcategory: state.subcategory === value ? null : value });
  };

  const toggleColor = (name: string) => {
    const next = state.colors.includes(name) ? state.colors.filter((c) => c !== name) : [...state.colors, name];
    onChange({ ...state, colors: next });
  };

  const toggleSize = (value: string) => {
    const next = state.sizes.includes(value) ? state.sizes.filter((s) => s !== value) : [...state.sizes, value];
    onChange({ ...state, sizes: next });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      brandSlugs: [],
      subcategory: null,
      colors: [],
      sizes: [],
      minPrice: null,
      maxPrice: null,
      sort: state.sort,
      onlyNew: false,
      onlyBestSellers: false,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {hasActiveFilters(state) && (
        <button
          type="button"
          onClick={clearFilters}
          className="label-caps self-start text-[11px] text-petrol hover:underline"
        >
          Limpar filtros
        </button>
      )}

      {!hideCategoryFilter && (
        <div>
          <p className="label-caps mb-3 text-[11px] text-graphite">Categoria</p>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                  state.categories.includes(cat.value)
                    ? "border-ink bg-ink text-paper"
                    : "border-mist text-graphite hover:border-ink hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {subcategories.length > 0 && (
        <div>
          <p className="label-caps mb-3 text-[11px] text-graphite">Subcategoria</p>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSubcategory(sub)}
                className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                  state.subcategory === sub
                    ? "border-ink bg-ink text-paper"
                    : "border-mist text-graphite hover:border-ink hover:text-ink"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {!hideBrandFilter && (
        <div>
          <p className="label-caps mb-3 text-[11px] text-graphite">Marca</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand.slug}
                type="button"
                onClick={() => toggleBrand(brand.slug)}
                className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                  state.brandSlugs.includes(brand.slug)
                    ? "border-petrol bg-petrol text-paper"
                    : "border-mist text-graphite hover:border-petrol hover:text-petrol"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="label-caps mb-3 text-[11px] text-graphite">Cor</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                aria-label={color.name}
                aria-pressed={state.colors.includes(color.name)}
                title={color.name}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                  state.colors.includes(color.name) ? "border-ink" : "border-transparent"
                }`}
              >
                <span className="h-6 w-6 rounded-full border border-mist" style={{ backgroundColor: color.hex }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="label-caps mb-3 text-[11px] text-graphite">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`label-caps flex h-9 min-w-9 items-center justify-center border px-2.5 text-[11px] transition-colors ${
                  state.sizes.includes(size)
                    ? "border-ink bg-ink text-paper"
                    : "border-mist text-graphite hover:border-ink hover:text-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="label-caps mb-3 text-[11px] text-graphite">Preço</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={`R$ ${priceBounds.min}`}
            value={state.minPrice ?? ""}
            onChange={(e) => onChange({ ...state, minPrice: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-full min-w-0 border border-mist px-2.5 py-2 text-xs outline-none focus:border-petrol"
          />
          <span className="shrink-0 text-xs text-graphite">até</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={`R$ ${priceBounds.max}`}
            value={state.maxPrice ?? ""}
            onChange={(e) => onChange({ ...state, maxPrice: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-full min-w-0 border border-mist px-2.5 py-2 text-xs outline-none focus:border-petrol"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...state, onlyNew: !state.onlyNew })}
          className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
            state.onlyNew ? "border-ink bg-ink text-paper" : "border-mist text-graphite hover:border-ink"
          }`}
        >
          Novidades
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...state, onlyBestSellers: !state.onlyBestSellers })}
          className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
            state.onlyBestSellers ? "border-ink bg-ink text-paper" : "border-mist text-graphite hover:border-ink"
          }`}
        >
          Mais vendidos
        </button>
      </div>
    </div>
  );
}
