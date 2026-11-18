import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import type { RootScreenProps } from "../navigation/types";
import { useAuth } from "../store/hooks";
import { updateProfile } from "../services/userService";
import { getErrorMessage } from "../api/client";
import { validatePhone, validateRequired } from "../utils/validators";
import { showMessage } from "../utils/dialog";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { colors } from "../theme";

export function EditProfileScreen({ navigation }: RootScreenProps<"EditProfile">) {
  const { user, patchUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = { name: validateRequired("họ tên")(name), phone: validatePhone(phone) };

  // BT9.4b
  const save = async () => {
    setTouched(true);
    if (errors.name || errors.phone || !user) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const updated = await updateProfile(user.id, { name: name.trim(), phone: phone.trim() });
      patchUser(updated); // cập nhật store để mọi màn đang đọc user cùng thấy bản mới
      showMessage("Đã lưu", "Thông tin hồ sơ đã được cập nhật.", () => navigation.goBack());
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <EmptyState emoji="🔒" title="Vui lòng đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <FormField label="Email (không thể đổi)" value={user.email} editable={false} containerStyle={{ opacity: 0.6 }} />
      <FormField label="Họ tên" value={name} onChangeText={setName} error={touched ? errors.name : null} autoCapitalize="words" />
      <FormField label="Số điện thoại" value={phone} onChangeText={setPhone} error={touched ? errors.phone : null} keyboardType="phone-pad" />
      {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}
      <PrimaryButton title="Lưu thay đổi" onPress={save} loading={loading} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  submitError: { color: colors.red, textAlign: "center", fontWeight: "600" },
});
