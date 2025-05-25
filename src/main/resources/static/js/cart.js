const CART_API = "/api/cart";

const userId = /*[[${userId}]]*/ null;
if (userId) {
    localStorage.setItem('userId', userId);
}

// Load giỏ hàng
async function loadCart() {
    const userId = localStorage.getItem("userId");
    let cartItems = [];

    try {
        if (userId) {
            // Người dùng đã đăng nhập → lấy từ DB
            const response = await fetch(`${CART_API}/${userId}`);
            if (!response.ok) {
                throw new Error("Không thể tải giỏ hàng từ server");
            }
            cartItems = await response.json();
        } else {
            // Người dùng chưa đăng nhập → lấy từ localStorage
            cartItems = JSON.parse(localStorage.getItem("guestCart")) || [];
        }

        // Hiển thị dữ liệu giỏ hàng
        const cartTable = document.getElementById("cartBody");
        cartTable.innerHTML = "";

        cartItems.forEach((item, index) => {
            cartTable.innerHTML += `
                <tr>
                    <td>${item.medicineName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary"
                            onclick="updateQuantity(${item.id}, ${item.quantity - 1}, ${userId ? 'true' : 'false'})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary"
                            onclick="updateQuantity(${item.id}, ${item.quantity + 1}, ${userId ? 'true' : 'false'})">+</button>
                    </td>

                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index}, ${userId ? 'true' : 'false'})">Xoá</button></td>
                </tr>`;
        });
    } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
    }
}


async function updateQuantity(cartItemId, newQuantity, isLoggedIn = false) {
    if (newQuantity <= 0) {
        removeFromCart(cartItemId, isLoggedIn);
        return;
    }

    if (isLoggedIn) {
        try {
            const response = await fetch(`${CART_API}/update-quantity/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({quantity: newQuantity})
            });

            if (response.ok) {
                loadCart();
            } else {
                console.error("Failed to update quantity from server");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

        guestCart = guestCart.map(item => {
            if (item.id === cartItemId) {
                item.quantity = newQuantity;
            }
            return item;
        });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        loadCart();
    }
}


// Xóa một sản phẩm khỏi giỏ hàng
async function removeFromCart(cartItemId, isLoggedIn = false) {
    if (isLoggedIn) {
        try {
            await fetch(`${CART_API}/remove/${cartItemId}`, {method: "DELETE"});
            loadCart();
        } catch (error) {
            console.error("Error removing item from server:", error);
        }
    } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        guestCart.splice(cartItemId, 1);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        loadCart();
    }
}


// Xóa toàn bộ giỏ hàng
async function clearCart() {
    const userId = localStorage.getItem("userId");

    if (userId) {
        try {
            await fetch(`${CART_API}/${userId}`, {method: "DELETE"});
            loadCart();
        } catch (error) {
            console.error("Error clearing cart from server:", error);
        }
    } else {
        // Xoá giỏ hàng local
        localStorage.removeItem("guestCart");
        loadCart();
    }
}


// Tải dữ liệu khi trang load
document.addEventListener("DOMContentLoaded", function () {
    loadCart();

});
