import { CommonActions } from "@react-navigation/native";
import type { TabParamList } from "./types";

type Nav = { dispatch: (action: any) => void };

// Về một tab và dọn sạch các màn phía trên (Login, Checkout…). Chạy được cả React Navigation 6 và 7.
export const goTab = (navigation: Nav, screen: keyof TabParamList) =>
  navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Tabs", params: { screen } }] }));

export const goHome = (navigation: Nav) => goTab(navigation, "Home");
