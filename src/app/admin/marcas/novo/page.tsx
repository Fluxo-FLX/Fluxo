import { BrandForm } from "@/components/admin/brand-form";
import { createBrandAction } from "../actions";

export default function NewBrandPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Nova marca</h1>
      <BrandForm action={createBrandAction} />
    </div>
  );
}
