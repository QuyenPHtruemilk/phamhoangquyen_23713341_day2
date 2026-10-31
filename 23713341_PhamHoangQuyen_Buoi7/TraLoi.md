# Trả lời câu hỏi bổ sung – Buổi 7

**1. Cấu trúc điều hướng.**
BookDetail được đăng ký ở Stack ngoài cùng nên khi mở nó phủ lên toàn màn hình, che luôn Tab Bar và có sẵn nút ← để quay về. Nếu đặt BookDetail vào Tab thì nó trở thành một tab riêng: Tab Bar vẫn hiện, không có nút quay lại, và phải bấm sang tab khác để thoát. Đó không phải hành vi mong muốn của một màn "chi tiết", vốn là màn con của danh sách.

**2. Redux.**
Redux Toolkit dùng thư viện Immer: trong reducer, `state` là một bản nháp (draft). Lệnh `state.items.push(...)` chỉ sửa trên bản nháp đó, sau đó Immer so sánh và tạo ra một state mới bất biến, còn state gốc không bị đụng tới. Nếu bỏ `useMemo` trong `useCart`, tổng số lượng và tổng tiền vẫn hiển thị đúng, chỉ là chúng bị tính lại ở mọi lần render. Với giỏ nhỏ thì không thấy khác biệt, giỏ lớn hoặc render nhiều thì lãng phí. `useMemo` chỉ để tối ưu, không quyết định đúng sai.

**3. Promise.all.**
`Promise.all` bị từ chối ngay khi một promise lỗi, nên nếu `getCategories()` lỗi còn `getBooks()` thành công thì Home vẫn rơi vào nhánh `catch` và hiện ErrorView, dù đã có dữ liệu sách. Dùng `Promise.allSettled` thì nhận kết quả của từng request, nhờ đó vẫn hiện được danh sách sách và chỉ thiếu hàng chip danh mục. Cái giá phải trả là phải tự kiểm tra `status` của từng kết quả, tự quyết định hiển thị gì cho phần lỗi (ví dụ báo nhẹ, nút thử lại riêng) và state phải có nhiều trạng thái lỗi hơn.

**4. Debounce.**
Nếu đặt `setTimeout` thẳng trong `onChangeText` thì mỗi ký tự gõ vào đều tạo một timer riêng và không timer nào bị huỷ, nên 10 ký tự vẫn gây 10 lần lọc (chỉ trễ đi chứ không gộp lại). Hàm dọn dẹp `return () => clearTimeout(t)` huỷ timer cũ mỗi khi `value` đổi, nhờ đó chỉ lần gõ cuối cùng được áp dụng. Nó cũng huỷ timer còn treo khi component bị gỡ (unmount), tránh cập nhật state trên component đã biến mất.

**5. Code bổ sung – sắp xếp theo giá.**
Thêm một state `sort` và sửa đúng một chỗ trong `visibleBooks` (file `HomeScreen.tsx`):

```tsx
const [sort, setSort] = useState<"asc" | "desc" | null>(null);

const visibleBooks = useMemo(() => {
  const filtered = filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange });
  if (sort === null) return filtered;
  return [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
}, [books, debouncedKeyword, categoryId, priceRange, sort]);
```

Dùng `[...filtered]` để sắp xếp trên bản sao, không làm đổi mảng gốc. Hai nút "Giá ↑" / "Giá ↓" trên Home gọi `setSort`, bấm lần nữa để bỏ sắp xếp. *(Ảnh chụp màn hình kết quả: tự chụp và đính kèm khi nộp.)*

---
### Thử thách C1 – vì sao đổi thư viện state thì giao diện không phải sửa?
Giao diện chỉ gọi `useWishlist()` (cũng như `useCart()`, `useAuth()`), không import `useDispatch` hay `useSelector`. Hook đóng vai trò adapter: chỉ `hooks.ts` biết Redux. Nếu đổi sang Zustand, chỉ cần viết lại thân các hook này mà vẫn giữ nguyên tên và kiểu trả về (`ids`, `has`, `toggle`), các màn hình không cần thay đổi.
