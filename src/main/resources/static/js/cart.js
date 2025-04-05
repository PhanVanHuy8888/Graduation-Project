const CART_API = "http://localhost:8080/api/cart";

// Kiểm tra người dùng đã đăng nhập chưa
const userId = localStorage.getItem("userId");
if (!userId) {
    window.location.href = "login"; // Chuyển hướng nếu chưa đăng nhập
}

// Load giỏ hàng
async function loadCart() {
    try {
        const response = await fetch(`${CART_API}/${userId}`);
        const data = await response.json();
        let cartTable = document.getElementById("cartBody");
        cartTable.innerHTML = "";

        data.forEach(item => {
            cartTable.innerHTML += `
                <tr>
                    <td>${item.medicineName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
                </tr>`;
        });
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

// Xóa một sản phẩm khỏi giỏ hàng
async function removeFromCart(cartId) {
    try {
        await fetch(`${CART_API}/${cartId}`, { method: "DELETE" });
        loadCart();
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// Xóa toàn bộ giỏ hàng
async function clearCart() {
    try {
        await fetch(`${CART_API}/${userId}`, { method: "DELETE" });
        loadCart();
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
}

// Tải dữ liệu khi trang load
document.addEventListener("DOMContentLoaded", function () {
    loadCart();

});
