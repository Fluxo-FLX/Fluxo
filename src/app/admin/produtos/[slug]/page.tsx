import { notFound } from "next/navigation";
import { getAllBrands, getProduct } from "@/lib/demo-data";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "../actions";

export default async function EditProductPage({ params }: PageProps<"/admin/produtos/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const brands = await getAllBrands();
  const boundAction = updateProductAction.bind(null, slug);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Editar produto</h1>
      <ProductForm product={product} brands={brands} action={boundAction} />
    </div>
  );
}
