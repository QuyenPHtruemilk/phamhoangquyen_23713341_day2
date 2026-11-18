# Trả lời câu hỏi bổ sung – Buổi 9

**1. Giá trị dẫn xuất.**
`errors` và `valid` là kết quả suy ra hoàn toàn từ `name`, `phone`, `address` và số sản phẩm trong giỏ, nên tính trực tiếp mỗi lần render thì luôn khớp với dữ liệu hiện tại và không cần nhớ cập nhật. Nếu lưu bằng `useState` riêng thì phải nhớ gọi `setErrors`/`setValid` ở mọi chỗ có `setName`, `setPhone`, `setAddress` hay khi giỏ đổi; quên một chỗ là lỗi hiển thị sai hoặc nút "Xác nhận đặt hàng" sáng/mờ sai so với form. Có thêm nguy cơ state bị trễ một nhịp vì `setState` không cập nhật ngay trong cùng lần render.

**2. Thứ tự gọi.**
Nếu `clear()` chạy trước `await createOrder(...)` thì khi mất mạng, giỏ đã bị xóa (cả trong store lẫn AsyncStorage vì `useAutoPersist` ghi mảng rỗng) mà đơn vẫn chưa được tạo trên server: người dùng mất toàn bộ sách đã chọn và phải chọn lại từ đầu. Đặt `clear()` ngay sau `await createOrder(...)` là đúng vì lệnh `await` chỉ chạy tiếp khi server đã nhận đơn thành công; nếu lỗi, `catch` chạy và `clear()` không bao giờ được gọi nên giỏ còn nguyên để bấm thử lại.

**3. PUT hay PATCH.**
`PUT /users/1` với `{ name, phone }` thay **toàn bộ** object nên user đó trong `db.json` chỉ còn `id`, `name`, `phone`; mất `email` và `password` (người dùng không đăng nhập được nữa). `PATCH` chỉ ghi đè các trường được gửi và giữ nguyên phần còn lại, nên bài này chọn PATCH cho form chỉnh sửa một phần (chỉ đổi tên và số điện thoại).

**4. Cập nhật lạc quan.**
Nếu bỏ đoạn hoàn lại `read: false` trong `catch` thì khi mất mạng, giao diện báo "đã đọc" nhưng server vẫn là chưa đọc; mở lại màn là thông báo quay về chưa đọc, người dùng khó hiểu vì sao. Nên dùng cách này cho thao tác nhẹ, ít khi lỗi và dễ hoàn lại như thả tim yêu thích hay đánh dấu đã đọc. Không nên dùng cho thanh toán/đặt hàng (và các thao tác tiền bạc): phải chắc server đã nhận thì mới được báo thành công và xóa giỏ.

**5. Code bổ sung – bộ lọc trạng thái đơn hàng (`OrdersScreen.tsx`).**

```tsx
type Filter = "all" | OrderStatus;
const [status, setStatus] = useState<Filter>("all");

// một chỗ sửa trong dữ liệu truyền cho FlatList
const shown = useMemo(
  () => orders.filter((o) => status === "all" || o.status === status),
  [orders, status]
);

<FlatList data={shown} ... />
```

Phía trên danh sách là hàng nút (Tất cả / Chờ xác nhận / Đang giao / Hoàn tất / Đã hủy) gọi `setStatus`. Khi bộ lọc không có đơn nào thì hiện "Không có đơn nào ở trạng thái này". *(Ảnh chụp màn hình kết quả: tự chụp và đính kèm khi nộp.)*

---
### Thử thách BT9.C1 – Mua lại
Đơn đã hoàn tất có nút **Mua lại** trong thẻ mở rộng. Hàm `reorder` gọi `getBooks()` để lấy giá và tồn kho mới nhất rồi thêm từng sách vào giỏ (cùng sách thì cộng số lượng, reducer `setQuantity` tự chặn ở tồn kho), sau đó chuyển sang tab Giỏ.
