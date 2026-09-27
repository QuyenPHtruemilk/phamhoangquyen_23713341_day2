import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TabBar, TabKey } from "../components/TabBar";
import { CartScreen } from "../screens/CartScreen";
import { CART_ITEMS } from "../../data";

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabKey>("cart");

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        {activeTab === "cart" ? (
          <CartScreen items={CART_ITEMS} />
        ) : (
          <Placeholder tab={activeTab} />
        )}
        <TabBar active={activeTab} onChange={setActiveTab} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function Placeholder({ tab }: { tab: TabKey }) {
  const note: Record<TabKey, string> = {
    home: 'Nội dung tab "Trang chủ" thuộc Giờ 4.',
    category: 'Nội dung tab "Danh mục" thuộc Giờ 2.',
    cart: "",
    account: "Tài liệu gốc không mô tả tab này, để trống.",
  };
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{note[tab]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  body: { flex: 1 },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  placeholderText: { textAlign: "center", color: "#5B6B7F" },
});
