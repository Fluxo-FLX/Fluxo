import { getAllBrands } from "@/lib/demo-data";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";

export default async function NewProductPage() {
  const brands = await getAllBrands();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Novo produto</h1>
      <ProductForm brands={brands} action={createProductAction} />
    </div>
  );
}
