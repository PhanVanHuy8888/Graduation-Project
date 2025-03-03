const CART_API  = "http://localhost:8080/api/cart";
const ORDER_API  = "http://localhost:8080/api/order";
const USER_API  = "http://localhost:8080/api/users/getUser";


// Cart
const userId = localStorage.getItem("userId") || ""; // Lấy userId từ localStorage nếu có

function loadCart() {
    const userId = localStorage.getItem("userId"); // Lấy userId nếu có
    let cartTable = document.getElementById("cartBody");
    cartTable.innerHTML = "";

    if (userId) {
        // Nếu có userId, tải giỏ hàng từ database
        fetch(`${CART_API}/${userId}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    cartTable.innerHTML += `
                        <tr>
                            <td>${item.medicineName}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id}, true)">Remove</button></td>
                        </tr>`;
                });
            })
            .catch(error => console.error("Error loading cart:", error));
    } else {
        // Nếu không có userId, tải giỏ hàng từ localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.forEach((item, index) => {
            cartTable.innerHTML += `
                <tr>
                    <td>${item.medicineName}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index}, false)">Remove</button></td>
                </tr>`;
        });
    }
}


function removeFromCart(cartId) {
    const userId = localStorage.getItem("userId"); // Kiểm tra userId

    if (userId) {
        // Nếu có userId, gọi API để xóa sản phẩm khỏi database
        fetch(`${CART_API}/${cartId}`, { method: "DELETE" })
            .then(() => loadCart()) // Cập nhật lại giỏ hàng
            .catch(error => console.error("Error removing item:", error));
    } else {
        // Nếu không có userId, xóa sản phẩm khỏi localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(cartId, 1); // Xóa theo index
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart(); // Cập nhật lại giao diện
    }
}

function clearCart() {
    const userId = localStorage.getItem("userId");

    if (userId) {
        // Nếu có userId, gọi API để xóa toàn bộ giỏ hàng
        fetch(`${CART_API}/${userId}`, { method: "DELETE" })
            .then(() => loadCart()) // Cập nhật lại giỏ hàng
            .catch(error => console.error("Error clearing cart:", error));
    } else {
        // Nếu không có userId, xóa giỏ hàng khỏi localStorage
        localStorage.removeItem("cart");
        loadCart(); // Cập nhật lại giao diện
    }
}


document.addEventListener("DOMContentLoaded", loadCart);


// Check out
document.addEventListener('DOMContentLoaded', function () {
    fetchCart();
    fetchUserData();
});

async function fetchCart() {
    try {
        const response = await fetch(`${CART_API}/${userId}`);
        const cart = await response.json();
        const cartList = document.getElementById('cartList');
        let totalSum = 0;
        const orderDetails = [];

        cartList.innerHTML = '';
        cart.forEach((item) => {
            cartList.innerHTML += `
                    <li class='list-group-item d-flex justify-content-between'>
                        <div>
                            <h6 class='my-0'>${item.medicineName}</h6>
                            <small class='text-muted'>SL: ${item.quantity}</small>
                        </div>
                        <span class='text-muted'>${item.price}</span>
                    </li>`;
            totalSum += item.price * item.quantity;
            orderDetails.push({ medicineName: item.medicineName, quantity: item.quantity, price: item.price });
        });
        cartList.innerHTML += `<li class='list-group-item d-flex justify-content-between'><strong>Tổng tiền</strong><strong>${totalSum}</strong></li>`;
        document.getElementById('totalAmount').textContent = totalSum;
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    } catch (error) {
        console.error('Lỗi tải giỏ hàng:', error);
    }
}

async function fetchUserData() {
    try {
        const response = await fetch(USER_API);
        const data = await response.json();
        if (data) {
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu khách hàng:', error);
    }
}

async function createOrder(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
    const price = parseFloat(document.getElementById('totalAmount').textContent);
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    const orderRequest = { email, phone, address, note, price, payment, userId, orderDetails };

    try {
        const response = await fetch(ORDER_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest)
        });
        if (response.ok) {
            window.location.href = 'success';
        } else {
            alert("Lỗi khi tạo đơn hàng");
        }
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
    }
}

