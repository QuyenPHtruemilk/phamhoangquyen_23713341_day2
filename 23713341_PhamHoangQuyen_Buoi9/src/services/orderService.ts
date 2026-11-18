import { api } from "../api/client";
import type { Order, OrderItem, PaymentMethod, ShippingAddress } from "../types";

export interface NewOrder {
  userId: number; items: OrderItem[]; total: number;
  address: ShippingAddress; paymentMethod: PaymentMethod;
}

// BT9.2 — POST /orders, json-server tự cấp id và ghi vào db.json
export async function createOrder(payload: NewOrder): Promise<Order> {
  const res = await api.post<Order>("/orders", { ...payload, status: "pending", createdAt: new Date().toISOString() });
  return res.data;
}

// BT9.3 — đơn của một người dùng, mới nhất trước
export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const res = await api.get<Order[]>("/orders", { params: { userId, _sort: "createdAt", _order: "desc" } });
  return res.data;
}
