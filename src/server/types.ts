import type { Product } from "@/lib/types";

/** What's actually held in the store — brandName is never persisted, only joined in at read time (see product-repository.ts). */
export type StoredProduct = Omit<Product, "brandName">;

export type Address = {
  id: string;
  label: string;
  recipient: string;
  cpf: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
};

export type UserRole = "customer" | "admin";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  addresses: Address[];
  resetToken?: string;
  resetTokenExpiresAt?: string;
};

export type OrderStatus =
  | "Pedido recebido"
  | "Pagamento aprovado"
  | "Em preparação"
  | "Enviado"
  | "Em trânsito"
  | "Entregue"
  | "Cancelado";

export type PaymentMethod = "pix" | "cartao" | "boleto";

export type OrderItem = {
  productSlug: string;
  name: string;
  brandName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  createdAt: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  address: Address;
  status: OrderStatus;
  tracking?: string;
};

export type CouponType = "percentual" | "fixo" | "frete-gratis";

export type Coupon = {
  code: string;
  type: CouponType;
  value: number;
  minSubtotal?: number;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
};

export type StoreSettings = {
  freeShippingThreshold: number;
  whatsappNumber: string;
};
