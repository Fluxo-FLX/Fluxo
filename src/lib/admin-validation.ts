import { z } from "zod";

export const productColorSchema = z.object({
  name: z.string().min(1, "Informe o nome da cor."),
  hex: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use um código hex válido (#000000)."),
});

export const productFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Informe o slug.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  name: z.string().min(2, "Informe o nome."),
  brandSlug: z.string().min(1, "Selecione uma marca."),
  category: z.enum(["fitness", "surf", "casual"]),
  subcategory: z.string().min(2, "Informe a subcategoria."),
  // Plain z.number() (no z.coerce) so the schema's input and output types
  // match — react-hook-form's `valueAsNumber` on the inputs does the
  // string→number conversion instead. Mixing z.coerce with useForm's
  // single-generic typing makes the resolver's input/output types diverge
  // and breaks inference for every other field in the form, not just this one.
  price: z.number("Informe um preço válido.").positive("Informe um preço válido."),
  compareAtPrice: z.union([z.number().positive(), z.literal("")]).optional(),
  stock: z.number("Use um número inteiro.").int("Use um número inteiro.").min(0, "Estoque não pode ser negativo."),
  colors: z.array(productColorSchema).min(1, "Adicione ao menos uma cor."),
  sizes: z.array(z.string()).min(1, "Selecione ao menos um tamanho."),
  description: z.string().min(10, "Escreva uma descrição com pelo menos 10 caracteres."),
  composition: z.string().min(2, "Informe a composição."),
  care: z.array(z.string().min(1, "Instrução de cuidado vazia.")).min(1, "Adicione ao menos uma instrução de cuidado."),
  tagsRaw: z.string().optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  imageTone: z.enum(["fitness", "surf", "casual", "lifestyle", "ink", "sand"]).optional(),
  images: z.array(z.string()).optional(),
  sizeGuideRows: z
    .array(
      z.object({
        label: z.string().min(1, "Informe o nome da medida."),
        values: z.record(z.string(), z.string()),
      }),
    )
    .optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export const brandFormSchema = z.object({
  slug: z
    .string()
    .min(2, "Informe o slug.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  name: z.string().min(2, "Informe o nome."),
  tagline: z.string().min(2, "Informe a assinatura da marca."),
  description: z.string().min(10, "Escreva uma descrição com pelo menos 10 caracteres."),
  history: z.string().min(2, "Informe a história da marca."),
  categories: z.array(z.enum(["fitness", "surf", "casual"])).min(1, "Selecione ao menos uma categoria."),
  accent: z.enum(["petrol", "sand", "ink"]),
});

export type BrandFormInput = z.infer<typeof brandFormSchema>;

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .min(3, "Informe um código com pelo menos 3 caracteres.")
      .regex(/^[A-Za-z0-9]+$/, "Use apenas letras e números, sem espaços.")
      .transform((v) => v.toUpperCase()),
    type: z.enum(["percentual", "fixo", "frete-gratis"]),
    value: z.number("Informe um valor válido.").min(0, "O valor não pode ser negativo."),
    minSubtotal: z.union([z.number().min(0), z.literal("")]).optional(),
    usageLimit: z.union([z.number().int().min(1), z.literal("")]).optional(),
    active: z.boolean(),
  })
  .refine((data) => data.type !== "percentual" || data.value <= 100, {
    message: "Cupom percentual não pode passar de 100%.",
    path: ["value"],
  });

export type CouponFormInput = z.infer<typeof couponFormSchema>;
