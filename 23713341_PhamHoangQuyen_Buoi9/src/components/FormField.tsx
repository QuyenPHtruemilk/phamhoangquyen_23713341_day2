import React from "react";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { colors } from "../theme";

interface Props extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string | null;
  right?: React.ReactNode;              // ví dụ nút 👁 hiện/ẩn mật khẩu
  containerStyle?: StyleProp<ViewStyle>; // ví dụ làm mờ ô bị khoá
}

export function FormField({ label, error, right, containerStyle, ...inputProps }: Props) {
  return (
    <View style={[s.wrap, containerStyle]}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputRow, !!error && s.inputError]}>
        <TextInput
          style={s.input}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          {...inputProps}
        />
        {right}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontWeight: "700", color: colors.text },
  inputRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderWidth: 1.5, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 12,
  },
  inputError: { borderColor: colors.red },
  input: { flex: 1, paddingVertical: 12, color: colors.text },
  error: { color: colors.red, fontSize: 12 },
});
