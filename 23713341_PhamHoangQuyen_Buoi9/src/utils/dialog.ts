import { Alert, Platform } from "react-native";

// Alert.alert không chạy trên bản web nên dùng confirm/alert của trình duyệt
const g = globalThis as any;

export function confirmDialog(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (g.confirm?.(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Hủy", style: "cancel" },
    { text: "Xóa", style: "destructive", onPress: onConfirm },
  ]);
}

// Hiện thông báo; onOk chạy khi người dùng bấm OK
export function showMessage(title: string, message: string, onOk?: () => void) {
  if (Platform.OS === "web") {
    g.alert?.(`${title}\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, [{ text: "OK", onPress: onOk }], { cancelable: false });
}
