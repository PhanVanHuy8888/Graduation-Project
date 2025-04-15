const CART_API = "http://localhost:8080/api/cart";

// Kiểm tra người dùng đã đăng nhập chưa
const userId = localStorage.getItem("userId");
if (!userId) {
    window.location.href = "/signin"; // Chuyển hướng nếu chưa đăng nhập
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
            <td>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </td>
            <td>${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
        </tr>`;
        });

    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

async function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
    }

    try {
        const response = await fetch(`${CART_API}/update-quantity/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            loadCart(); // reload cart to reflect updates
        } else {
            console.error("Failed to update quantity");
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}


// Xóa một sản phẩm khỏi giỏ hàng
async function removeFromCart(cartId) {
    try {
        await fetch(`${CART_API}/${cartId}`, {method: "DELETE"});
        loadCart();
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// Xóa toàn bộ giỏ hàng
async function clearCart() {
    try {
        await fetch(`${CART_API}/${userId}`, {method: "DELETE"});
        loadCart();
    } catch (error) {
        console.error("Error clearing cart:", error);
    }
}

// Tải dữ liệu khi trang load
document.addEventListener("DOMContentLoaded", function () {
    loadCart();

});
