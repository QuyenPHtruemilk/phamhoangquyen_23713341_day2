import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CartItem } from "../../data";

export function CartLineItem({ item }: { item: CartItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumbWrap}>
        <Image source={{ uri: item.book.cover }} style={styles.thumb} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.book.title}
      </Text>

      <View style={styles.meta}>
        <View style={styles.qtyPill}>
          <Text style={styles.qtyText}>x{item.quantity}</Text>
        </View>
        <Text style={styles.price}>
          {(item.book.price * item.quantity).toLocaleString()} đ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#4338CA",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  thumbWrap: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#EEF2F7",
  },
  thumb: { width: 48, height: 64 },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2340",
    lineHeight: 18,
  },
  meta: { width: 92, alignItems: "flex-end", gap: 4 },
  qtyPill: {
    backgroundColor: "#E4E1FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  qtyText: { fontSize: 11, fontWeight: "700", color: "#4338CA" },
  price: { fontSize: 13, fontWeight: "800", color: "#DC2626" },
});
