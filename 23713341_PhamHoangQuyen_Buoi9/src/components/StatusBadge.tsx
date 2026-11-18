import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { OrderStatus } from "../types";

const MAP: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  pending:   { label: "Chờ xác nhận", bg: "#FFF4D6", fg: "#B7791F" },
  shipping:  { label: "Đang giao",    bg: "#DCEBFF", fg: "#1F5FBF" },
  completed: { label: "Hoàn tất",     bg: "#DDF5E6", fg: "#1B9C5A" },
  cancelled: { label: "Đã hủy",       bg: "#FFE1E1", fg: "#C62828" },
};
export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: MAP.pending.label, shipping: MAP.shipping.label, completed: MAP.completed.label, cancelled: MAP.cancelled.label,
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = MAP[status];
  return (
    <View style={[s.badge, { backgroundColor: m.bg }]}>
      <Text style={[s.text, { color: m.fg }]}>{m.label}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  text: { fontSize: 12, fontWeight: "700" },
});
