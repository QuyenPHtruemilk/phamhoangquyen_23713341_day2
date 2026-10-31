import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../store/hooks";
import { colors } from "../theme";

export function AccountScreen() {
  const { user, isLoggedIn, signIn, signOut } = useAuth();

  return (
    <View style={s.root}>
      <SafeAreaView edges={["top"]} style={s.header}><Text style={s.title}>👤 Tài khoản</Text></SafeAreaView>
      {isLoggedIn && user ? (
        <View style={s.body}>
          <View style={s.avatar}><Text style={s.avatarText}>{user.name.charAt(0)}</Text></View>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.email}>{user.email}</Text>
          <Pressable style={[s.btn, { backgroundColor: colors.red }]} onPress={signOut}>
            <Text style={s.btnText}>Đăng xuất</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.body}>
          <Text style={s.lock}>🔒</Text>
          <Text style={s.name}>Bạn chưa đăng nhập</Text>
          <Text style={s.email}>Đăng nhập để xem thông tin tài khoản.</Text>
          <Pressable
            style={s.btn}
            onPress={() => signIn({ id: 1, name: "Học viên Demo", email: "demo@bookstore.vn" }, "fake-token")}
          >
            <Text style={s.btnText}>Đăng nhập thử</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.navy, paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", paddingTop: 8 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
  lock: { fontSize: 56 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.indigo, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  email: { color: colors.muted },
  btn: { backgroundColor: colors.indigo, borderRadius: 12, paddingHorizontal: 28, paddingVertical: 12, marginTop: 12 },
  btnText: { color: "#fff", fontWeight: "800" },
});
