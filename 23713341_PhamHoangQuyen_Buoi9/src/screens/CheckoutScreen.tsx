import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootScreenProps } from "../navigation/types";
import { goHome } from "../navigation/helpers";
import type { PaymentMethod } from "../types";
import { useAuth, useCart } from "../store/hooks";
import { createOrder } from "../services/orderService";
import { getErrorMessage } from "../api/client";
import { validatePhone, validateRequired } from "../utils/validators";
import { showMessage } from "../utils/dialog";
import { formatPrice } from "../utils/format";
import { FormField } from "../components/FormField";
import { PaymentOption } from "../components/PaymentOption";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme";

export function CheckoutScreen({ navigation, route }: RootScreenProps<"Checkout">) {
  const { isLoggedIn, user } = useAuth();
  const { items, clear } = useCart();
  const total = route.params.total; // đã trừ mã giảm giá ở màn Giỏ

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Chưa đăng nhập thì chuyển sang Login (replace, bấm ← không quay lại)
  useEffect(() => {
    if (!isLoggedIn) navigation.replace("Login", { redirectTo: "Checkout", total });
  }, [isLoggedIn, navigation, total]);

  // BT9.1a — lỗi và valid được TÍNH từ state mỗi lần render
  const errors = {
    name: validateRequired("họ tên người nhận")(name),
    phone: validatePhone(phone),
    address: validateRequired("địa chỉ giao hàng")(address),
  };
  const valid = !errors.name && !errors.phone && !errors.address && items.length > 0;

  // BT9.2
  const submit = async () => {
    setTouched(true);
    if (!valid || !user) return;
    setLoading(true);
    setSubmitError(null);
    try {
      await createOrder({
        userId: user.id,
        items: items.map((i) => ({ bookId: i.bookId, title: i.title, price: i.price, quantity: i.quantity })),
        total,
        address: { name: name.trim(), phone: phone.trim(), address: address.trim() },
        paymentMethod: payment,
      });
      clear(); // chỉ xóa giỏ SAU khi server đã nhận đơn; useAutoPersist tự xóa AsyncStorage
      showMessage("Đặt hàng thành công 🎉", "Cảm ơn bạn đã mua sắm tại BookStore!", () => goHome(navigation));
    } catch (e) {
      setSubmitError(getErrorMessage(e)); // lỗi: giữ nguyên giỏ
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={s.card}>
        <Text style={s.h}>Tóm tắt đơn hàng</Text>
        {items.map((i) => (
          <View key={i.bookId} style={s.itemRow}>
            <Text style={s.itemTitle} numberOfLines={1}>{i.title} × {i.quantity}</Text>
            <Text style={s.itemPrice}>{formatPrice(i.price * i.quantity)}</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Tổng thanh toán</Text>
          <Text style={s.total}>{formatPrice(total)}</Text>
        </View>
      </View>

      <Text style={s.h}>Địa chỉ giao hàng</Text>
      <FormField label="Họ tên người nhận" value={name} onChangeText={setName} error={touched ? errors.name : null} autoCapitalize="words" />
      <FormField label="Số điện thoại" value={phone} onChangeText={setPhone} error={touched ? errors.phone : null} keyboardType="phone-pad" />
      <FormField
        label="Địa chỉ" value={address} onChangeText={setAddress} error={touched ? errors.address : null}
        autoCapitalize="sentences" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
      />

      <Text style={s.h}>Phương thức thanh toán</Text>
      <PaymentOption label="Thanh toán khi nhận hàng (COD)" selected={payment === "cod"} onPress={() => setPayment("cod")} />
      <PaymentOption label="Chuyển khoản ngân hàng" hint="Chỉ minh hoạ giao diện" selected={payment === "bank"} onPress={() => setPayment("bank")} />

      {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}
      <PrimaryButton title="Xác nhận đặt hàng" onPress={submit} loading={loading} disabled={!valid} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 8 },
  h: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: 4 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { color: colors.muted },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 4 },
  totalLabel: { color: colors.muted },
  total: { fontSize: 22, fontWeight: "800", color: colors.indigo },
  submitError: { color: colors.red, textAlign: "center", fontWeight: "600" },
});
