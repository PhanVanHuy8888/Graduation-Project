const USER_API = "http://localhost:8080/api/users/getUser";
const CART_API = "http://localhost:8080/api/cart";
const ORDER_API = "http://localhost:8080/api/order";


document.addEventListener("DOMContentLoaded", function () {
    fetchUserData(); // Lấy thông tin user
    fetchCart();
    fetchOrders();
});

function fetchOrders() {
    fetch(ORDER_API)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("orderTableBody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach((order, index) => {
                let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${order.orderCode}</td>
                            <td>${order.userName}</td>
                            <td>${order.payment}</td>
                            <td>${order.createdAt}</td>
                            <td class="${order.paymentStatus === 'Đang xử lý' ? 'text-success' : 'text-danger'}">
                                ${order.paymentStatus}
                            </td>
                            <td>
                                <a class="badge badge-outline-info" href="#" onclick='viewOrder(${JSON.stringify(order)})'>View</a>
                            </td>
                        </tr>
                    `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Lỗi khi lấy đơn hàng:", error));
}

function viewOrder(order) {
    console.log(order); // Kiểm tra dữ liệu đầu vào
    console.log(order.orderDetails); // Kiểm tra dữ liệu đầu vào

    document.getElementById("orderCode").textContent = order.orderCode || "N/A";
    document.getElementById("orderEmail").textContent = order.email || "N/A";
    document.getElementById("orderPhone").textContent = order.phone || "N/A";
    document.getElementById("orderPayment").textContent = order.payment || "N/A";
    document.getElementById("orderNote").textContent = order.note || "N/A";
    document.getElementById("orderCreateAt").textContent = order.createdAt || "N/A";

    // Hiển thị danh sách thuốc trong đơn hàng
    const orderDetailsTable = document.getElementById("orderDetailsTable");
    orderDetailsTable.innerHTML = "";

    let totalAmount = 0; // Khởi tạo biến tổng tiền

    if (!order.orderDetails || !Array.isArray(order.orderDetails)) {
        console.error("orderDetails không hợp lệ:", order.orderDetails);
        orderDetailsTable.innerHTML = "<tr><td colspan='4' class='text-center'>Không có sản phẩm nào</td></tr>";
    } else {
        order.orderDetails.forEach(detail => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${detail.medicineName || "N/A"}</td>
                <td>${detail.quantity || 0}</td>
                <td>${detail.price || 0} VND</td>
                <td>${detail.total || 0} VND</td>
            `;
            orderDetailsTable.appendChild(row);

            // Tính tổng tiền cho mỗi đơn hàng
            totalAmount += detail.total || 0;
        });
    }

    // Thêm hàng tổng tiền vào bảng
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="3" class="text-right"><strong>Tổng tiền</strong></td>
        <td><strong>${totalAmount} VND</strong></td>
    `;
    orderDetailsTable.appendChild(totalRow);

    // Hiển thị modal
    let modal = new bootstrap.Modal(document.getElementById("orderModal"));
    modal.show();
}



// Lấy dữ liệu người dùng
async function fetchUserData() {
    try {
        const response = await fetch(USER_API);
        const data = await response.json();
        if (data) {
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';

            // Lưu userId vào localStorage để dùng cho giỏ hàng
            // localStorage.setItem('userId', data.id);
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu khách hàng:', error);
    }
}

// Lấy dữ liệu giỏ hàng
async function fetchCart() {
    try {
        const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
        if (!userId) {
            console.error("User ID không tồn tại.");
            return;
        }

        const response = await fetch(`${CART_API}/${userId}`);

        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
        }

        const cart = await response.json();

        console.log("Dữ liệu giỏ hàng từ API:", cart); // Kiểm tra dữ liệu

        if (!Array.isArray(cart)) {
            console.error("Dữ liệu giỏ hàng không phải mảng:", cart);
            document.getElementById('cartList').innerHTML = `
                <li class='list-group-item text-center text-danger'>Lỗi dữ liệu giỏ hàng</li>`;
            return;
        }

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
                    <span class='text-muted'>${item.price} VND</span>
                </li>`;
            totalSum += item.price * item.quantity;
            orderDetails.push({ medicineName: item.medicineName, quantity: item.quantity, price: item.price });
        });

        cartList.innerHTML += `<li class='list-group-item d-flex justify-content-between'><strong>Tổng tiền</strong><strong>${totalSum} VND</strong></li>`;
        document.getElementById('totalAmount').textContent = totalSum;
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    } catch (error) {
        console.error('Lỗi tải giỏ hàng:', error);
        document.getElementById('cartList').innerHTML = `
            <li class='list-group-item text-center text-danger'>Không thể tải giỏ hàng</li>`;
    }
}


// Xử lý thanh toán
async function createOrder(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

    if (!userId) {
        alert("Không tìm thấy thông tin người dùng.");
        return;
    }

    try {
        const cartResponse = await fetch(`${CART_API}/${userId}`);
        const cart = await cartResponse.json();
        let totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderRequest = { email, phone, address, note, price: totalSum, payment, userId, orderDetails: cart };

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


