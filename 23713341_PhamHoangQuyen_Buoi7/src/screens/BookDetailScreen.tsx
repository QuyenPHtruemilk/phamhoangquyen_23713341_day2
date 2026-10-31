import React, { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootScreenProps } from "../navigation/types";
import type { Book } from "../types";
import { getBookById } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useCart, useWishlist } from "../store/hooks";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { formatPrice } from "../utils/format";
import { colors } from "../theme";

export function BookDetailScreen({ route }: RootScreenProps<"BookDetail">) {
  const { bookId } = route.params; // BT7.2 — nhận bookId
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, items } = useCart();
  const { has, toggle } = useWishlist();

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setBook(await getBookById(bookId)); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, [bookId]);
  useEffect(() => { load(); }, [load]); // BT7.5d

  if (loading) return <LoadingView />;                                                          // BT7.5e
  if (error || !book) return <ErrorView message={error ?? "Không tìm thấy sách."} onRetry={load} />;

  const inCart = items.find((i) => i.bookId === book.id)?.quantity ?? 0;
  const wished = has(book.id);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.content}>
      <View style={[s.cover, { backgroundColor: book.color }]}><Text style={s.emoji}>{book.emoji}</Text></View>
      <View style={s.card}>
        <View style={s.titleRow}>
          <Text style={s.title}>{book.title}</Text>
          <Pressable onPress={() => toggle(book.id)} hitSlop={10}>
            <Text style={s.heart}>{wished ? "♥" : "♡"}</Text>
          </Pressable>
        </View>
        <Text style={s.author}>{book.author}</Text>
        <Text style={s.price}>{formatPrice(book.price)}</Text>
        <Text style={s.stock}>Còn {book.stock} cuốn trong kho{inCart > 0 ? ` · Đã có ${inCart} trong giỏ` : ""}</Text>
        <Text style={s.desc}>{book.description}</Text>
      </View>
      <Pressable
        style={s.btn}
        onPress={() => add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock })} // BT7.3c
      >
        <Text style={s.btnText}>Thêm vào giỏ</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  cover: { height: 200, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 88 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 6 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: "800", color: colors.text },
  heart: { fontSize: 28, color: colors.red },
  author: { color: colors.muted },
  price: { fontSize: 22, fontWeight: "800", color: colors.indigo, marginTop: 4 },
  stock: { color: colors.muted, fontSize: 12 },
  desc: { color: colors.text, lineHeight: 21, marginTop: 8 },
  btn: { backgroundColor: colors.indigo, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
