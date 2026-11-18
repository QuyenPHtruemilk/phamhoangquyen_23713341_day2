import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppNotification } from "../types";
import { formatDateTime } from "../utils/format";
import { colors } from "../theme";

interface Props { item: AppNotification; onPress: (n: AppNotification) => void }

export function NotificationItem({ item, onPress }: Props) {
  return (
    <Pressable style={[s.card, !item.read && s.unread]} onPress={() => onPress(item)}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[s.title, !item.read && { fontWeight: "800" }]}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.time}>{formatDateTime(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={s.dot} />}
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { flexDirection: "row", gap: 10, backgroundColor: "#fff", borderRadius: 14, padding: 14, alignItems: "flex-start" },
  unread: { backgroundColor: "#EAF3FF" },
  title: { fontWeight: "700", color: colors.text },
  body: { color: colors.text, fontSize: 13 },
  time: { color: colors.muted, fontSize: 11 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.red, marginTop: 4 },
});
