// Cart
const userId = localStorage.getItem("userId") || ""; // Lấy userId từ localStorage nếu có

function loadCart() {
    fetch(`http://localhost:8080/api/cart/${userId}`)
        .then(response => response.json())
        .then(data => {
            let cartTable = document.getElementById("cartBody");
            cartTable.innerHTML = "";
            data.forEach(item => {
                cartTable.innerHTML += `
                            <tr>
                                <td>${item.medicineName}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>${item.total.toFixed(2)}</td>
                                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button></td>
                            </tr>`;
            });
        })
        .catch(error => console.error("Error loading cart:", error));
}

function removeFromCart(cartId) {
    fetch(`http://localhost:8080/api/cart/remove/${cartId}`, { method: "DELETE" })
        .then(() => loadCart())
        .catch(error => console.error("Error removing item:", error));
}

function clearCart() {
    fetch(`http://localhost:8080/api/cart/clear/${userId}`, { method: "DELETE" })
        .then(() => loadCart())
        .catch(error => console.error("Error clearing cart:", error));
}

document.addEventListener("DOMContentLoaded", loadCart);


// Check out