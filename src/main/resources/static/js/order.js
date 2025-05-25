const USER_API = "/api/users/getUser";
const CART_API = "/api/cart";
const ORDER_API = "/api/order";

document.addEventListener("DOMContentLoaded", function () {
    fetchUserData();
    fetchCart();
    fetchOrders();
});

function fetchOrders(page = 0) {
    currentPage = page;
    fetch(`${ORDER_API}?page=${page}&size=8`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("orderTableBody");
            tableBody.innerHTML = "";

            data.content.forEach((order, index) => {
                let row = `
                    <tr>
                        <td>${index + 1 + page * 8}</td>
                        <td>${order.orderCode}</td>
                        <td>${order.userName}</td>
                        <td>${order.payment}</td>
                        <td>${order.createdAt}</td>
                        <td class="${order.paymentStatus === 'Đang xử lý' ? 'text-danger' : 'text-success'}">
                            ${order.paymentStatus}
                        </td>
                        <td>
                            <a class="badge badge-outline-info" href="#" onclick='viewOrder(${JSON.stringify(order)})'>Xem</a>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            renderPagination(data.totalPages);
        })
        .catch(error => console.error("Lỗi khi lấy đơn hàng:", error));
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        paginationContainer.innerHTML += `
            <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}"
                    onclick="fetchOrders(${i})">${i + 1}</button>
        `;
    }
}

function viewOrder(order) {
    document.getElementById("orderCode").textContent = order.orderCode || "N/A";
    document.getElementById("orderEmail").textContent = order.email || "N/A";
    document.getElementById("orderPhone").textContent = order.phone || "N/A";
    document.getElementById("orderPayment").textContent = order.payment || "N/A";
    document.getElementById("orderNote").textContent = order.note || "N/A";
    document.getElementById("orderCreateAt").textContent = order.createdAt || "N/A";

    const orderDetailsTable = document.getElementById("orderDetailsTable");
    orderDetailsTable.innerHTML = "";

    let totalAmount = 0;

    if (!order.orderDetails || !Array.isArray(order.orderDetails)) {
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
            totalAmount += detail.total || 0;
        });
    }

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="3" class="text-right"><strong>Tổng tiền</strong></td>
        <td><strong>${totalAmount} VND</strong></td>
    `;
    orderDetailsTable.appendChild(totalRow);

    let modal = new bootstrap.Modal(document.getElementById("orderModal"));
    modal.show();
}

async function fetchUserData() {
    try {
        const userId = localStorage.getItem('userId');
        if(userId) {
            const response = await fetch(USER_API);
            const data = await response.json();
            if (data && data.id) {
                document.getElementById('username').value = data.userName || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('phone').value = data.phone || '';
                document.getElementById('address').value = data.address || '';
                localStorage.setItem('userId', data.id);
            } else {
                localStorage.removeItem('userId');
            }
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu khách hàng:', error);
        localStorage.removeItem('userId');
    }
}

async function fetchCart() {
    try {
        const cartList = document.getElementById('cartList');
        let cart = [];
        let totalSum = 0;
        const orderDetails = [];

        const userId = localStorage.getItem('userId');
        const isLoggedIn = userId && userId !== "undefined";

        if (isLoggedIn) {
            const response = await fetch(`${CART_API}/${userId}`);
            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
            }
            cart = await response.json();
        } else {
            const guestCart = localStorage.getItem('guestCart');
            if (!guestCart) {
                cartList.innerHTML = `<li class='list-group-item text-center text-muted'>Giỏ hàng trống</li>`;
                document.getElementById('totalAmount').textContent = 0;
                return;
            }
            cart = JSON.parse(guestCart);
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            cartList.innerHTML = `<li class='list-group-item text-center text-muted'>Giỏ hàng trống</li>`;
            document.getElementById('totalAmount').textContent = 0;
            return;
        }

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

        cartList.innerHTML += `
            <li class='list-group-item d-flex justify-content-between'>
                <strong>Tổng tiền</strong>
                <strong>${totalSum} VND</strong>
            </li>`;
        document.getElementById('totalAmount').textContent = totalSum;

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    } catch (error) {
        console.error('Lỗi tải giỏ hàng:', error);
        document.getElementById('cartList').innerHTML = `<li class='list-group-item text-center text-danger'>Không thể tải giỏ hàng</li>`;
    }
}
async function createOrder(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    const payment = document.querySelector('input[name="paymentMethod"]:checked').value;
    const username = document.getElementById('username') ? document.getElementById('username').value : null;
    const userId = localStorage.getItem('userId');
    const isLoggedIn = userId && userId !== "undefined";

    let cart = [];
    let totalSum = 0;

    try {
        if (isLoggedIn) {
            const cartResponse = await fetch(`${CART_API}/${userId}`);
            cart = await cartResponse.json();
        } else {
            const guestCart = localStorage.getItem('guestCart');
            if (guestCart) {
                cart = JSON.parse(guestCart);
            }
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderRequest = {
            email,
            phone,
            address,
            note,
            price: totalSum,
            payment,
            userId: isLoggedIn ? userId : null,
            username: !isLoggedIn ? username : null,
            orderDetails: cart
        };

        const response = await fetch(ORDER_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest)
        });

        const result = await response.json();
        const orderId = result.id;

        if (response.ok) {
            if (!isLoggedIn) {
                localStorage.removeItem('guestCart');
            }

            // Chuyển hướng tùy theo phương thức thanh toán
            if (payment === "ONLINE") {
                // Chuyển sang trang thanh toán demo kèm theo số tiền
                window.location.href = `payment?orderId=${orderId}&price=${totalSum}`;
            } else {
                window.location.href = 'success.html';
            }

        } else {
            alert("Lỗi khi tạo đơn hàng.");
        }

    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        alert("Có lỗi xảy ra khi tạo đơn hàng.");
    }
}

