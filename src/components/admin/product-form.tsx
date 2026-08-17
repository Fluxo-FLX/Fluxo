"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormInput } from "@/lib/admin-validation";
import type { Brand, CategorySlug, Product } from "@/lib/types";
import type { PlaceholderTone } from "@/components/placeholder-photo";
import type { ProductMutationResult } from "@/server/repositories/product-repository";
import { uploadImageAction } from "@/app/actions/upload";

const CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "fitness", label: "Fitness" },
  { value: "surf", label: "Surf" },
  { value: "street", label: "Street" },
];

const ALL_SIZES = ["PP", "P", "M", "G", "GG", "Único"];

const IMAGE_TONES: { value: PlaceholderTone; label: string }[] = [
  { value: "fitness", label: "Fitness" },
  { value: "surf", label: "Surf" },
  { value: "street", label: "Street" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "ink", label: "Ink" },
  { value: "sand", label: "Sand" },
];

function labelClass() {
  return "label-caps text-[11px] text-graphite";
}

function inputClass(hasError?: boolean) {
  return `border px-3 py-2 text-base outline-none focus:border-petrol sm:text-sm ${hasError ? "border-red-500" : "border-mist"}`;
}

export type ProductFormAction = (input: ProductFormInput) => Promise<ProductMutationResult>;

export function ProductForm({
  product,
  brands,
  action,
}: {
  product?: Product;
  brands: Brand[];
  action: ProductFormAction;
}) {
  const router = useRouter();
  const isEditing = Boolean(product);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          slug: product.slug,
          name: product.name,
          brandSlug: product.brandSlug,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? "",
          stock: product.stock,
          colors: product.colors,
          sizes: product.sizes,
          description: product.description,
          composition: product.composition,
          care: product.care,
          tagsRaw: product.tags.join(", "),
          isNew: product.isNew ?? false,
          isBestSeller: product.isBestSeller ?? false,
          imageTone: product.imageTone,
          images: product.images ?? [],
          sizeGuideRows: product.sizeGuideRows ?? [],
        }
      : {
          colors: [{ name: "Preto", hex: "#111111" }],
          sizes: [],
          care: [""],
          category: "fitness",
          images: [],
          sizeGuideRows: [],
        },
  });

  const colorFields = useFieldArray({ control, name: "colors" });
  // useFieldArray only supports arrays of objects (it needs somewhere to
  // attach a stable key) — `care`/`images` are plain string[], so they're
  // managed as local state and synced into the form via setValue instead.
  const [careItems, setCareItems] = useState<string[]>(product?.care ?? [""]);
  const [imageItems, setImageItems] = useState<string[]>(product?.images ?? []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sizeGuideRows, setSizeGuideRows] = useState<{ label: string; values: Record<string, string> }[]>(
    product?.sizeGuideRows ?? [],
  );
  const selectedSizes = watch("sizes") ?? [];

  const updateCare = (next: string[]) => {
    setCareItems(next);
    setValue("care", next, { shouldValidate: true });
  };

  const updateImages = (next: string[]) => {
    setImageItems(next);
    setValue("images", next, { shouldValidate: true });
  };

  const updateSizeGuideRows = (next: { label: string; values: Record<string, string> }[]) => {
    setSizeGuideRows(next);
    setValue("sizeGuideRows", next, { shouldValidate: true });
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadError(null);
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData);
      if (!result.success) {
        setUploadError(result.error);
        return;
      }
      const next = [...imageItems];
      next[index] = result.url;
      updateImages(next);
    } catch {
      setUploadError("Não foi possível enviar a imagem. Tente novamente.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const toggleSize = (size: string) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setValue("sizes", next, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormInput) => {
    setServerError(null);
    const result = await action(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/produtos");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="name">
            Nome
          </label>
          <input id="name" className={inputClass(Boolean(errors.name))} {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="slug">
            Slug (URL)
          </label>
          <input
            id="slug"
            disabled={isEditing}
            className={`${inputClass(Boolean(errors.slug))} disabled:bg-mist/40 disabled:text-graphite`}
            {...register("slug")}
          />
          {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="brandSlug">
            Marca
          </label>
          <select id="brandSlug" className={inputClass(Boolean(errors.brandSlug))} {...register("brandSlug")}>
            <option value="">Selecione…</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brandSlug && <p className="text-xs text-red-600">{errors.brandSlug.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="category">
            Categoria
          </label>
          <select id="category" className={inputClass()} {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="subcategory">
            Subcategoria
          </label>
          <input
            id="subcategory"
            placeholder="Camisetas, Shorts…"
            className={inputClass(Boolean(errors.subcategory))}
            {...register("subcategory")}
          />
          {errors.subcategory && <p className="text-xs text-red-600">{errors.subcategory.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="price">
            Preço (R$)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className={inputClass(Boolean(errors.price))}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="compareAtPrice">
            Preço &ldquo;de&rdquo; (opcional)
          </label>
          <input
            id="compareAtPrice"
            type="number"
            step="0.01"
            className={inputClass()}
            {...register("compareAtPrice", { setValueAs: (v) => (v === "" ? "" : Number(v)) })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass()} htmlFor="stock">
            Estoque
          </label>
          <input
            id="stock"
            type="number"
            className={inputClass(Boolean(errors.stock))}
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && <p className="text-xs text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClass()}>Cores</p>
          <button
            type="button"
            onClick={() => colorFields.append({ name: "", hex: "#111111" })}
            className="label-caps text-[11px] text-petrol hover:underline"
          >
            + adicionar cor
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {colorFields.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-9 shrink-0 border border-mist"
                {...register(`colors.${index}.hex`)}
              />
              <input
                placeholder="Nome da cor"
                className={`flex-1 ${inputClass(Boolean(errors.colors?.[index]?.name))}`}
                {...register(`colors.${index}.name`)}
              />
              <button
                type="button"
                onClick={() => colorFields.remove(index)}
                disabled={colorFields.fields.length <= 1}
                className="label-caps px-2 text-[11px] text-graphite hover:text-red-600 disabled:opacity-30"
              >
                remover
              </button>
            </div>
          ))}
        </div>
        {errors.colors && !Array.isArray(errors.colors) && (
          <p className="mt-1 text-xs text-red-600">{errors.colors.message}</p>
        )}
      </div>

      <div>
        <p className={labelClass() + " mb-2"}>Tamanhos</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                selectedSizes.includes(size)
                  ? "border-ink bg-ink text-paper"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.sizes && <p className="mt-1 text-xs text-red-600">{errors.sizes.message as string}</p>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClass()}>Tabela de medidas (cm)</p>
          <button
            type="button"
            onClick={() => updateSizeGuideRows([...sizeGuideRows, { label: "", values: {} }])}
            disabled={selectedSizes.length === 0}
            className="label-caps text-[11px] text-petrol hover:underline disabled:pointer-events-none disabled:text-graphite disabled:opacity-50"
          >
            + adicionar medida
          </button>
        </div>
        {selectedSizes.length === 0 ? (
          <p className="text-xs text-graphite">Selecione ao menos um tamanho para cadastrar medidas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sizeGuideRows.map((row, index) => (
              <div key={index} className="border border-mist p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    placeholder="Nome da medida (ex: Tórax)"
                    className={`min-w-0 flex-1 ${inputClass()}`}
                    value={row.label}
                    onChange={(e) => {
                      const next = [...sizeGuideRows];
                      next[index] = { ...row, label: e.target.value };
                      updateSizeGuideRows(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => updateSizeGuideRows(sizeGuideRows.filter((_, i) => i !== index))}
                    className="label-caps shrink-0 px-2 text-[11px] text-graphite hover:text-red-600"
                  >
                    remover
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSizes.map((s) => (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <span className="label-caps text-[10px] text-graphite">{s}</span>
                      <input
                        placeholder="cm"
                        className={`w-16 text-center ${inputClass()}`}
                        value={row.values[s] ?? ""}
                        onChange={(e) => {
                          const next = [...sizeGuideRows];
                          next[index] = { ...row, values: { ...row.values, [s]: e.target.value } };
                          updateSizeGuideRows(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sizeGuideRows.length === 0 && (
              <p className="text-xs text-graphite">
                Sem medidas cadastradas. O guia de tamanhos do produto ficará sem tabela até você adicionar uma.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass()} htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          rows={3}
          className={inputClass(Boolean(errors.description))}
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass()} htmlFor="composition">
          Composição
        </label>
        <input id="composition" className={inputClass(Boolean(errors.composition))} {...register("composition")} />
        {errors.composition && <p className="text-xs text-red-600">{errors.composition.message}</p>}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClass()}>Cuidados</p>
          <button
            type="button"
            onClick={() => updateCare([...careItems, ""])}
            className="label-caps text-[11px] text-petrol hover:underline"
          >
            + adicionar instrução
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {careItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className={`flex-1 ${inputClass()}`}
                value={item}
                onChange={(e) => {
                  const next = [...careItems];
                  next[index] = e.target.value;
                  updateCare(next);
                }}
              />
              <button
                type="button"
                onClick={() => updateCare(careItems.filter((_, i) => i !== index))}
                disabled={careItems.length <= 1}
                className="label-caps px-2 text-[11px] text-graphite hover:text-red-600 disabled:opacity-30"
              >
                remover
              </button>
            </div>
          ))}
        </div>
        {errors.care && !Array.isArray(errors.care) && (
          <p className="mt-1 text-xs text-red-600">{errors.care.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass()} htmlFor="tagsRaw">
          Tags (separadas por vírgula)
        </label>
        <input id="tagsRaw" className={inputClass()} {...register("tagsRaw")} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className={labelClass()}>Fotos do produto (URLs)</p>
          <button
            type="button"
            onClick={() => updateImages([...imageItems, ""])}
            className="label-caps text-[11px] text-petrol hover:underline"
          >
            + adicionar foto
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {imageItems.map((url, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2">
              <div className="flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden border border-mist bg-mist/30 text-[9px] text-graphite">
                {url && (
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
              <input
                placeholder="https://exemplo.com/foto.jpg"
                className={`min-w-0 flex-1 ${inputClass()}`}
                value={url}
                onChange={(e) => {
                  const next = [...imageItems];
                  next[index] = e.target.value;
                  updateImages(next);
                }}
              />
              <label className="label-caps flex h-9 shrink-0 cursor-pointer items-center justify-center border border-mist px-3 text-center text-[11px] text-graphite transition-colors hover:border-ink">
                {uploadingIndex === index ? "Enviando…" : "Enviar arquivo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploadingIndex !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => updateImages(imageItems.filter((_, i) => i !== index))}
                className="label-caps px-2 text-[11px] text-graphite hover:text-red-600"
              >
                remover
              </button>
            </div>
          ))}
        </div>
        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
        {imageItems.length === 0 && (
          <p className="mt-2 text-xs text-graphite">
            Sem fotos, o produto usa uma imagem ilustrativa até que você adicione uma. Clique em
            &ldquo;+ adicionar foto&rdquo; e depois em &ldquo;Enviar arquivo&rdquo; para subir do computador ou
            celular, ou cole uma URL diretamente.
          </p>
        )}
      </div>

      <div>
        <p className={labelClass() + " mb-2"}>Tratamento visual (imagem ilustrativa)</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setValue("imageTone", undefined)}
            className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
              !watch("imageTone") ? "border-ink bg-ink text-paper" : "border-mist text-graphite hover:border-ink"
            }`}
          >
            Automático (por categoria)
          </button>
          {IMAGE_TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setValue("imageTone", tone.value)}
              className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                watch("imageTone") === tone.value
                  ? "border-ink bg-ink text-paper"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" {...register("isNew")} />
          Novidade
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4" {...register("isBestSeller")} />
          Best seller
        </label>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="label-caps bg-ink px-8 py-4 text-xs text-paper transition-colors hover:bg-petrol disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </form>
  );
}
