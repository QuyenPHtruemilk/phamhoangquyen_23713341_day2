import React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { BOOKS, CATEGORIES } from "../../data";

export function HomeScreen({
  cartCount,
  onPressBook,
  onPressCart,
}: {
  cartCount: number;
  onPressBook: (id: number) => void;
  onPressCart: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookStore</Text>
        <Text style={styles.headerSubtitle}>Khám phá sách hay mỗi ngày</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map((cat) => (
            <View key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {BOOKS.map((book) => (
            <Pressable
              key={book.id}
              style={styles.card}
              onPress={() => onPressBook(book.id)}
            >
              <View style={styles.coverWrap}>
                <Image source={{ uri: book.cover }} style={styles.cover} />
                {book.isNew ? (
                  <View style={[styles.badge, styles.badgeNew]}>
                    <Text style={styles.badgeText}>Mới</Text>
                  </View>
                ) : book.discountPercent ? (
                  <View style={[styles.badge, styles.badgeSale]}>
                    <Text style={styles.badgeText}>
                      -{book.discountPercent}%
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.cardAuthor} numberOfLines={1}>
                {book.author}
              </Text>
              <Text style={styles.cardPrice}>
                {book.price.toLocaleString()} đ
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={onPressCart}>
        <Text style={styles.fabIcon}>🛒</Text>
        {cartCount > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  headerSubtitle: { marginTop: 2, fontSize: 13, color: "#6B7280" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 96 },
  chipsRow: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  chipText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    rowGap: CARD_GAP,
  },
  card: { width: "48%" },
  coverWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    backgroundColor: "#EEF2F7",
    overflow: "hidden",
  },
  cover: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeNew: { backgroundColor: "#16A34A" },
  badgeSale: { backgroundColor: "#DC2626" },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  cardTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    minHeight: 34,
  },
  cardAuthor: { marginTop: 2, fontSize: 12, color: "#6B7280" },
  cardPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#1E1B4B",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4338CA",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabIcon: { fontSize: 22 },
  fabBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  fabBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
});
