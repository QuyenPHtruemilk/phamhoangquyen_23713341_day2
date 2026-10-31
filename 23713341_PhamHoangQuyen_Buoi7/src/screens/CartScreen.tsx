import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TabScreenProps } from "../navigation/types";
import { useCart } from "../store/hooks";
import { EmptyState } from "../components/EmptyState";
import { formatPrice } from "../utils/format";
import { colors } from "../theme";

export function CartScreen({ navigation }: TabScreenProps<"Cart">) {
  const { items, totalPrice, totalQuantity, setQty, remove } = useCart(); // BT7.3f

  return (
    <View style={s.root}>
      <SafeAreaView edges={["top"]} style={s.header}><Text style={s.title}>🛒 Giỏ hàng</Text></SafeAreaView>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.bookId)}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        ListEmptyComponent={<EmptyState emoji="🛒" title="Giỏ hàng trống" message="Hãy thêm vài cuốn sách yêu thích." />}
        renderItem={({ item }) => (
          <View style={s.item}>
            <View style={[s.thumb, { backgroundColor: item.color }]}><Text style={{ fontSize: 28 }}>{item.emoji}</Text></View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.name} numberOfLines={2}>{item.title}</Text>
              <Text style={s.price}>{formatPrice(item.price)}</Text>
              <View style={s.qtyRow}>
                <Pressable style={s.qtyBtn} onPress={() => setQty(item.bookId, item.quantity - 1)}><Text style={s.qtyText}>−</Text></Pressable>
                <Text style={s.qty}>{item.quantity}</Text>
                <Pressable style={s.qtyBtn} onPress={() => setQty(item.bookId, item.quantity + 1)}><Text style={s.qtyText}>＋</Text></Pressable>
                <Text style={s.stock}>/ {item.stock}</Text>
              </View>
            </View>
            <Pressable onPress={() => remove(item.bookId)} hitSlop={10}><Text style={s.del}>🗑️</Text></Pressable>
          </View>
        )}
      />
      <View style={s.footer}>
        <View>
          <Text style={s.totalLabel}>Tổng ({totalQuantity} cuốn)</Text>
          <Text style={s.total}>{formatPrice(totalPrice)}</Text>
        </View>
        <Pressable
          style={[s.pay, items.length === 0 && { opacity: 0.4 }]}
          disabled={items.length === 0}
          onPress={() => navigation.navigate("Checkout", { total: totalPrice })} // BT7.2b
        >
          <Text style={s.payText}>Thanh toán</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.navy, paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", paddingTop: 8 },
  item: { flexDirection: "row", gap: 12, backgroundColor: "#fff", borderRadius: 16, padding: 12, alignItems: "center" },
  thumb: { width: 64, height: 76, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  name: { fontWeight: "700", color: colors.text },
  price: { color: colors.indigo, fontWeight: "800" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 16, fontWeight: "700", color: colors.text },
  qty: { minWidth: 18, textAlign: "center", fontWeight: "700" },
  stock: { color: colors.muted, fontSize: 12 },
  del: { fontSize: 20 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 16 },
  totalLabel: { color: colors.muted, fontSize: 12 },
  total: { fontSize: 20, fontWeight: "800", color: colors.text },
  pay: { backgroundColor: colors.indigo, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  payText: { color: "#fff", fontWeight: "800" },
});
