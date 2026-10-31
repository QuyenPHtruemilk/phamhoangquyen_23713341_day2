# BookStore – Buổi 7

## Tạo project và cài thư viện
```bash
npx create-expo-app@latest BookStoreApp --template blank-typescript
cd BookStoreApp
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context expo-constants
npm install @reduxjs/toolkit react-redux axios
npm install -D json-server@0.17.4
```
Chép **App.tsx, db.json, src/, TraLoi.md** của gói này đè vào project.

Thêm vào `scripts` trong package.json:
```json
"api": "json-server --watch db.json --port 3000 --host 0.0.0.0"
```

## Chạy
```bash
npm run api          # Terminal 1  → http://localhost:3000/books
npx expo start -c    # Terminal 2
npx tsc --noEmit     # kiểm tra kiểu trước khi nộp
```
Điện thoại thật: cùng Wi-Fi (app tự lấy IP máy tính). Nếu vẫn lỗi:
`$env:EXPO_PUBLIC_API_URL="http://<IP-máy-tính>:3000"; npx expo start -c`
