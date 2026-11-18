import { api } from "../api/client";
import type { User } from "../types";

// BT9.4 — PATCH chỉ đổi các trường được gửi (PUT sẽ thay cả object và làm mất email, mật khẩu)
export async function updateProfile(id: number, data: Pick<User, "name" | "phone">): Promise<User> {
  const res = await api.patch<User & { password?: string }>(`/users/${id}`, data);
  const { password: _pw, ...user } = res.data; // không đưa mật khẩu vào store
  return user;
}
