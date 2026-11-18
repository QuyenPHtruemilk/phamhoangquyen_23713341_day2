import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

interface Props {
  title: string; onPress: () => void; loading?: boolean; disabled?: boolean;
  variant?: "solid" | "outline";
}

export function PrimaryButton({ title, onPress, loading, disabled, variant = "solid" }: Props) {
  const off = loading || disabled;
  const outline = variant === "outline";
  return (
    <Pressable style={[s.btn, outline && s.outline, off && { opacity: 0.5 }]} onPress={onPress} disabled={off}>
      {loading ? <ActivityIndicator color={outline ? colors.indigo : "#fff"} /> : <Text style={[s.text, outline && { color: colors.indigo }]}>{title}</Text>}
    </Pressable>
  );
}
const s = StyleSheet.create({
  btn: { backgroundColor: colors.indigo, borderRadius: 14, paddingVertical: 14, alignItems: "center", justifyContent: "center", minHeight: 50 },
  outline: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: colors.indigo },
  text: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
