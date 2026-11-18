import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TabScreenProps } from "../navigation/types";
import { useAuth, useWishlist } from "../store/hooks";
import { MenuItem } from "../components/MenuItem";
import { colors } from "../theme";

export function AccountScreen({ navigation }: TabScreenProps<"Account">) {
  const { user, isLoggedIn, signOut } = useAuth();
  const { ids } = useWishlist();

  return (
    <View style={s.root}>
      <SafeAreaView edges={["top"]} style={s.header}><Text style={s.title}>👤 Tài khoản</Text></SafeAreaView>
      {isLoggedIn && user ? (
        <ScrollView contentContainerStyle={s.body}>
          <View style={s.avatar}><Text style={s.avatarText}>{user.name.charAt(0).toUpperCase()}</Text></View>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.email}>{user.email}</Text>
          {user.phone ? <Text style={s.email}>📞 {user.phone}</Text> : null}
          <Pressable onPress={() => navigation.navigate("EditProfile")} style={s.editBtn}>
            <Text style={s.editText}>✎ Chỉnh sửa</Text>
          </Pressable>

          <View style={s.menu}>
            <MenuItem emoji="🧾" label="Đơn hàng của tôi" onPress={() => navigation.navigate("Orders")} />
            <MenuItem emoji="🔔" label="Thông báo" onPress={() => navigation.navigate("Notifications")} />
            <MenuItem emoji="♥" label={`Danh sách yêu thích (${ids.length})`} onPress={() => navigation.navigate("Wishlist")} />
          </View>

          <Pressable style={[s.btn, { backgroundColor: colors.red }]} onPress={signOut}>
            <Text style={s.btnText}>Đăng xuất</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.lock}>🔒</Text>
          <Text style={s.name}>Bạn chưa đăng nhập</Text>
          <Text style={s.email}>Đăng nhập để thanh toán và viết đánh giá.</Text>
          <Pressable style={s.btn} onPress={() => navigation.navigate("Login")}>
            <Text style={s.btnText}>Đăng nhập</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={s.link}>Chưa có tài khoản? <Text style={s.linkBold}>Đăng ký</Text></Text>
          </Pressable>
          <View style={s.menu}>
            <MenuItem emoji="♥" label={`Danh sách yêu thích (${ids.length})`} onPress={() => navigation.navigate("Wishlist")} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.navy, paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", paddingTop: 8 },
  body: { alignItems: "center", gap: 6, padding: 24, flexGrow: 1 },
  lock: { fontSize: 56, marginTop: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.indigo, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 6 },
  email: { color: colors.muted, textAlign: "center" },
  editBtn: { borderWidth: 1.5, borderColor: colors.indigo, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 6, marginTop: 8 },
  editText: { color: colors.indigo, fontWeight: "700" },
  menu: { alignSelf: "stretch", gap: 10, marginTop: 18 },
  btn: { backgroundColor: colors.indigo, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12, marginTop: 18 },
  btnText: { color: "#fff", fontWeight: "800" },
  link: { color: colors.muted, marginTop: 8 },
  linkBold: { color: colors.indigo, fontWeight: "800" },
});
