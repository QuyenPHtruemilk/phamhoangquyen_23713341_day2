import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { RootScreenProps } from "../navigation/types";
import { useCart } from "../store/hooks";
import { formatPrice } from "../utils/format";
import { colors } from "../theme";

export function CheckoutScreen({ route, navigation }: RootScreenProps<"Checkout">) {
  const { items, clear } = useCart();

  const confirm = () => {
    clear();
    Alert.alert("Đặt hàng thành công", "Cảm ơn bạn đã mua sách tại BookStore!");
    navigation.navigate("Tabs", { screen: "Home" });
  };

  return (
    <View style={s.root}>
      <View style={s.card}>
        <Text style={s.label}>Số mặt hàng</Text>
        <Text style={s.value}>{items.length}</Text>
        <Text style={[s.label, { marginTop: 16 }]}>Tổng thanh toán</Text>
        <Text style={s.total}>{formatPrice(route.params.total)}</Text>
      </View>
      <Pressable style={s.btn} onPress={confirm}>
        <Text style={s.btnText}>Xác nhận đặt hàng</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  label: { color: colors.muted },
  value: { fontSize: 18, fontWeight: "700", color: colors.text },
  total: { fontSize: 30, fontWeight: "800", color: colors.indigo },
  btn: { backgroundColor: colors.indigo, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
