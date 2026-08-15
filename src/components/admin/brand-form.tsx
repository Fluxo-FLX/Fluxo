"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandFormSchema, type BrandFormInput } from "@/lib/admin-validation";
import type { Brand, CategorySlug } from "@/lib/types";

const CATEGORIES: { value: CategorySlug; label: string }[] = [
  { value: "fitness", label: "Fitness" },
  { value: "surf", label: "Surf" },
  { value: "casual", label: "Casual" },
];

const ACCENTS: { value: Brand["accent"]; label: string }[] = [
  { value: "petrol", label: "Petróleo" },
  { value: "sand", label: "Areia" },
  { value: "ink", label: "Tinta" },
];

function labelClass() {
  return "label-caps text-[11px] text-graphite";
}

function inputClass(hasError?: boolean) {
  return `border px-3 py-2 text-base outline-none focus:border-petrol sm:text-sm ${hasError ? "border-red-500" : "border-mist"}`;
}

export type BrandMutationResult = { success: true; brand: Brand } | { success: false; error: string };
export type BrandFormAction = (input: BrandFormInput) => Promise<BrandMutationResult>;

export function BrandForm({ brand, action }: { brand?: Brand; action: BrandFormAction }) {
  const router = useRouter();
  const isEditing = Boolean(brand);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormInput>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: brand
      ? {
          slug: brand.slug,
          name: brand.name,
          tagline: brand.tagline,
          description: brand.description,
          history: brand.history,
          categories: brand.categories,
          accent: brand.accent,
        }
      : {
          categories: [],
          accent: "petrol",
        },
  });

  const selectedCategories = watch("categories") ?? [];
  const selectedAccent = watch("accent");

  const toggleCategory = (category: CategorySlug) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setValue("categories", next, { shouldValidate: true });
  };

  const onSubmit = async (data: BrandFormInput) => {
    setServerError(null);
    const result = await action(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/marcas");
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

      <div className="flex flex-col gap-1.5">
        <label className={labelClass()} htmlFor="tagline">
          Assinatura da marca
        </label>
        <input id="tagline" className={inputClass(Boolean(errors.tagline))} {...register("tagline")} />
        {errors.tagline && <p className="text-xs text-red-600">{errors.tagline.message}</p>}
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
        <label className={labelClass()} htmlFor="history">
          História da marca
        </label>
        <textarea id="history" rows={3} className={inputClass(Boolean(errors.history))} {...register("history")} />
        {errors.history && <p className="text-xs text-red-600">{errors.history.message}</p>}
      </div>

      <div>
        <p className={labelClass() + " mb-2"}>Categorias</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => toggleCategory(category.value)}
              className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                selectedCategories.includes(category.value)
                  ? "border-ink bg-ink text-paper"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        {errors.categories && <p className="mt-1 text-xs text-red-600">{errors.categories.message as string}</p>}
      </div>

      <div>
        <p className={labelClass() + " mb-2"}>Cor de destaque</p>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((accent) => (
            <button
              key={accent.value}
              type="button"
              onClick={() => setValue("accent", accent.value, { shouldValidate: true })}
              className={`label-caps border px-3.5 py-2 text-[11px] transition-colors ${
                selectedAccent === accent.value
                  ? "border-ink bg-ink text-paper"
                  : "border-mist text-graphite hover:border-ink"
              }`}
            >
              {accent.label}
            </button>
          ))}
        </div>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="label-caps bg-ink px-8 py-4 text-xs text-paper transition-colors hover:bg-petrol disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar marca"}
        </button>
      </div>
    </form>
  );
}
