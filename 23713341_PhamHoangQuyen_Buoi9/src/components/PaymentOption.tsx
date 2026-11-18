import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

interface Props { label: string; hint?: string; selected: boolean; onPress: () => void }

export function PaymentOption({ label, hint, selected, onPress }: Props) {
  return (
    <Pressable style={[s.card, selected && s.selected]} onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }}>
      <Text style={[s.radio, selected && { color: colors.indigo }]}>{selected ? "◉" : "○"}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.label}>{label}</Text>
        {!!hint && <Text style={s.hint}>{hint}</Text>}
      </View>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: colors.line },
  selected: { borderColor: colors.indigo, backgroundColor: "#F2F3FF" },
  radio: { fontSize: 22, color: colors.muted },
  label: { fontWeight: "700", color: colors.text },
  hint: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
