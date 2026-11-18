import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootScreenProps } from "../navigation/types";
import { goHome, goTab } from "../navigation/helpers";
import type { Order, OrderStatus, PaymentMethod } from "../types";
import { getOrdersByUser } from "../services/orderService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { showMessage } from "../utils/dialog";
import { formatPrice, formatDateTime } from "../utils/format";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { StatusBadge, STATUS_LABEL } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme";

const PAYMENT_LABEL: Record<PaymentMethod, string> = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" };

type Filter = "all" | OrderStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: STATUS_LABEL.pending },
  { key: "shipping", label: STATUS_LABEL.shipping },
  { key: "completed", label: STATUS_LABEL.completed },
  { key: "cancelled", label: STATUS_LABEL.cancelled },
];

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user } = useAuth();
  const { items: cartItems, add, setQty } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null); // chỉ nhớ id của thẻ đang mở
  const [status, setStatus] = useState<Filter>("all");        // câu hỏi bổ sung số 5

  // BT9.3a
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => orders.filter((o) => status === "all" || o.status === status), [orders, status]);

  // BT9.C1 — mua lại: lấy giá và tồn kho mới nhất rồi thêm vào giỏ
  const reorder = async (order: Order) => {
    try {
      const books = await getBooks();
      order.items.forEach((it) => {
        const book = books.find((b) => b.id === it.bookId);
        if (!book) return;
        const inCart = cartItems.find((c) => c.bookId === it.bookId);
        if (!inCart) add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock });
        setQty(it.bookId, (inCart?.quantity ?? 0) + it.quantity); // reducer tự chặn ở tồn kho
      });
      showMessage("Đã thêm vào giỏ", "Các sản phẩm của đơn hàng đã được thêm lại vào giỏ.", () => goTab(navigation, "Cart"));
    } catch (e) {
      showMessage("Không thể mua lại", getErrorMessage(e));
    }
  };

  if (!user) {
    return <EmptyState emoji="🔒" title="Vui lòng đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView label="Đang tải đơn hàng…" />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {orders.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterBar} contentContainerStyle={s.filterRow}>
          {FILTERS.map((f) => (
            <Pressable key={f.key} onPress={() => setStatus(f.key)} style={[s.chip, status === f.key && s.chipOn]}>
              <Text style={[s.chipText, status === f.key && s.chipTextOn]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <FlatList
        data={shown}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={{ padding: 12, gap: 10, flexGrow: 1 }}
        ListEmptyComponent={
          orders.length === 0 ? (
            <EmptyState emoji="🧾" title="Bạn chưa có đơn hàng nào" message="Đặt đơn đầu tiên để theo dõi tại đây."
              actionLabel="Mua sắm ngay" onAction={() => goHome(navigation)} />
          ) : (
            <EmptyState emoji="🔎" title="Không có đơn nào ở trạng thái này" />
          )
        }
        renderItem={({ item: o }) => {
          const open = openId === o.id;
          return (
            <View style={s.card}>
              <Pressable onPress={() => setOpenId(open ? null : o.id)} style={s.head}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={s.code}>Đơn #{o.id}</Text>
                  <Text style={s.date}>{formatDateTime(o.createdAt)}</Text>
                  <Text style={s.total}>{formatPrice(o.total)}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <StatusBadge status={o.status} />
                  <Text style={s.toggle}>{open ? "Thu gọn ▲" : "Chi tiết ▼"}</Text>
                </View>
              </Pressable>
              {open && (
                <View style={s.detail}>
                  {o.items.map((it) => (
                    <View key={it.bookId} style={s.itemRow}>
                      <Text style={s.itemTitle} numberOfLines={1}>{it.title} × {it.quantity}</Text>
                      <Text style={s.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
                    </View>
                  ))}
                  <View style={s.addr}>
                    <Text style={s.addrH}>Giao đến</Text>
                    <Text style={s.addrT}>{o.address.name} · {o.address.phone}</Text>
                    <Text style={s.addrT}>{o.address.address}</Text>
                    <Text style={s.addrT}>Thanh toán: {PAYMENT_LABEL[o.paymentMethod]}</Text>
                  </View>
                  {o.status === "completed" && <PrimaryButton title="Mua lại" variant="outline" onPress={() => reorder(o)} />}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  filterBar: { flexGrow: 0 },
  filterRow: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  chipTextOn: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  head: { flexDirection: "row", gap: 10, padding: 14 },
  code: { fontWeight: "800", color: colors.text, fontSize: 16 },
  date: { color: colors.muted, fontSize: 12 },
  total: { color: colors.indigo, fontWeight: "800", marginTop: 2 },
  toggle: { color: colors.muted, fontSize: 12 },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, padding: 14, gap: 8 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { color: colors.muted },
  addr: { backgroundColor: colors.bg, borderRadius: 10, padding: 10, gap: 2, marginTop: 4 },
  addrH: { fontWeight: "800", color: colors.text },
  addrT: { color: colors.text, fontSize: 13 },
});
