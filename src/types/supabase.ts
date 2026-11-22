export type OrderStatus =
  | "pending"
  | "verification_required"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type CartLine = {
  product_id: string;
  variant_id: string;
  quantity: number;
};
