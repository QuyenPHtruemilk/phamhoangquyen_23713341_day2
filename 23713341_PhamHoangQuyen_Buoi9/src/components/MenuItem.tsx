import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

interface Props { emoji: string; label: string; onPress: () => void }

export function MenuItem({ emoji, label, onPress }: Props) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <Text style={s.emoji}>{emoji}</Text>
      <Text style={s.label}>{label}</Text>
      <Text style={s.chev}>›</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, alignSelf: "stretch", backgroundColor: "#fff", borderRadius: 14, padding: 16 },
  emoji: { fontSize: 20 },
  label: { flex: 1, fontWeight: "700", color: colors.text },
  chev: { fontSize: 22, color: colors.muted },
});
