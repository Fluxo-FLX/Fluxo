import { notFound } from "next/navigation";
import { findCoupon } from "@/server/repositories/coupon-repository";
import { CouponForm } from "@/components/admin/coupon-form";
import { updateCouponAction } from "../actions";

export default async function EditCouponPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const coupon = await findCoupon(code);
  if (!coupon) notFound();

  const boundAction = updateCouponAction.bind(null, coupon.code);

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Editar cupom</h1>
      <CouponForm coupon={coupon} action={boundAction} />
    </div>
  );
}
