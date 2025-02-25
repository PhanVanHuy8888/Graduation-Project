const API_URL = "http://localhost:8080/api/medicines";
const CATEGORY_API = "http://localhost:8080/api/category-medicine";
const CART_API  = "http://localhost:8080/api/cart";
const SUPPLIER_API = "http://localhost:8080/api/supplier";
const urlParams = new URLSearchParams(window.location.search);
const medicineId = urlParams.get("id");

// Fetch danh sách category và supplier
async function fetchCategoriesAndSuppliers() {
    try {
        // Fetch Category
        const categoryResponse = await fetch(CATEGORY_API);
        const categories = await categoryResponse.json();
        let categorySelect = document.getElementById("categoryMedicine");
        categorySelect.innerHTML = `<option value="">-- Select Category Medicine --</option>`;
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.categoryMedicineName}</option>`;
        });

        // Fetch Supplier
        const supplierResponse = await fetch(SUPPLIER_API);
        const suppliers = await supplierResponse.json();
        let supplierSelect = document.getElementById("supplier");
        supplierSelect.innerHTML = `<option value="">-- Select Supplier --</option>`;
        suppliers.forEach(supplier => {
            supplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.supplierName}</option>`;
        });
    } catch (error) {
        console.error("Error fetching categories or suppliers:", error);
    }
}

// Fetch & hiển thị danh sách thuốc
function fetchMedicines() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("medicineTable");
            tableBody.innerHTML = "";
            data.forEach((medicine, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${medicine.name}</td>
                    <td>
                        <img src="${medicine.image}" width="150" alt="$${medicine.image}" onerror="this.onerror=null;this.src='default.jpg';">
                    </td>
                    <td>${medicine.price}</td>
                    <td>
                        <a class="badge badge-outline-warning" href="edit-medicine?id=${medicine.id}">Edit</a>
                        <button class="badge badge-outline-danger" onclick="deleteMedicine(${medicine.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching medicines:", error));
}

async function fetchMedicinesIndex() {
    try {
        const response = await fetch(API_URL);
        const medicine = await response.json();
        const medicineContainer = document.getElementById('medicineContainer');

        medicine.forEach((medicine) => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('col-lg-4', 'col-md-12', 'mb-4');

            // Định dạng giá bằng JavaScript
            const formattedPrice = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(medicine.price);

            medicineCard.innerHTML = `
                    <div class="card" >
                        <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                            <img class="w-100" src="${medicine.image}" alt="${medicine.name}">

                        </div>
                        <div class="card-body">
                            <a href="#" class="text-reset">
                                <h5 class="card-title mb-3">${medicine.name}</h5>
                            </a>
                            <a href="#" class="text-reset">
                                <p>${medicine.categoryMedicine.categoryMedicineName}</p>
                            </a>
                            <h6 class="mb-3">
                                <span class="text-black rounded-pill py-2 px-3 font-weight-bold">
                                    ${formattedPrice}
                                </span>
                            </h6>
                            <button class="btn btn-primary" onclick="addToCart('${medicine.name}', ${medicine.price})">
                                Chọn mua
                            </button>
                        </div>
                    </div>
                `;

            medicineContainer.appendChild(medicineCard);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const userId = document.getElementById("userId")?.value;
    if (userId) {
        localStorage.setItem("userId", userId);
        console.log("user id", userId);
    }
});


// Start add Cart

// var userId = "${userId}";
// if (userId) {
//     localStorage.setItem("userId", userId);
//     console.log("User ID stored:", userId);
// }

async function addToCart(medicineName, price) {
    const userId = localStorage.getItem("userId") || ""; // Lấy userId từ localStorage nếu có

    console.log("Sending request with:", { userId, medicineName, price });

    const cartData = {
        userId: userId,
        medicineName: medicineName,
        price: price,
        quantity: 1
    };

    try {
        const response = await fetch(CART_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartData)
        });

        const result = await response.json();
        console.log("Response:", result);
        alert(result.message);
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Lỗi khi thêm vào giỏ hàng!");
    }
}


// document.addEventListener("DOMContentLoaded", loadMedicines);

// End add Cart

// Xóa thuốc
function deleteMedicine(id) {
    if (confirm("Are you sure you want to delete this medicine?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => fetchMedicines())
            .catch(error => console.error("Error deleting medicine:", error));
    }
}

// Thêm thuốc
if (window.location.pathname.includes("/add-medicine")) {
    fetchCategoriesAndSuppliers();

    document.getElementById("addMedicineForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let categoryId = document.getElementById("categoryMedicine").value;
        let supplierId = document.getElementById("supplier").value;

        if (!categoryId || !supplierId) {
            alert("Vui lòng chọn danh mục và nhà cung cấp!");
            return;
        }

        let medicineData = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value,
            manufacturer: document.getElementById("manufacturer").value,
            ingredient: document.getElementById("ingredient").value,
            registrationNumber: document.getElementById("registrationNumber").value,
            qualityStandards: document.getElementById("qualityStandards").value,
            shelfLife: document.getElementById("shelfLife").value,
            dosageForm: document.getElementById("dosageForm").value,
            specification: document.getElementById("specification").value,
            origin: document.getElementById("origin").value,
            quantity: document.getElementById("quantity").value,
            categoryMedicineId: categoryId,
            supplierId: supplierId
        };

        let formData = new FormData();
        formData.append("medicine", new Blob([JSON.stringify(medicineData)], { type: "application/json" }));

        let imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        } // Nếu không có ảnh, nó sẽ không được gửi đi

        fetch(API_URL, {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                let medicineImage = document.getElementById("image"); // ID của <img>
                medicineImage.src = "/img/" + data.image + "?t=" + new Date().getTime(); // Thêm timestamp để tránh cache
                window.location.href = "list-medicine";
            })
            .catch(error => console.error("Error adding medicine:", error));
    });
}

// Chỉnh sửa thuốc
if (window.location.pathname.includes("/edit-medicine")) {
    fetchCategoriesAndSuppliers().then(() => {
        fetch(`${API_URL}/${medicineId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("medicineId").value = data.id;
                document.getElementById("name").value = data.name;
                document.getElementById("price").value = data.price;
                document.getElementById("description").value = data.description;
                document.getElementById("manufacturer").value = data.manufacturer;
                document.getElementById("ingredient").value = data.ingredient;
                document.getElementById("registrationNumber").value = data.registrationNumber;
                document.getElementById("qualityStandards").value = data.qualityStandards;
                document.getElementById("shelfLife").value = data.shelfLife;
                document.getElementById("dosageForm").value = data.dosageForm;
                document.getElementById("specification").value = data.specification;
                document.getElementById("origin").value = data.origin;
                document.getElementById("quantity").value = data.quantity;
                document.getElementById("categoryMedicine").value = data.categoryMedicine.id;
                document.getElementById("supplier").value = data.supplier.id;
            })
            .catch(error => console.error("Error fetching medicine details:", error));
    });

    document.getElementById("editMedicineForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let categoryId = document.getElementById("categoryMedicine").value;
        let supplierId = document.getElementById("supplier").value;

        if (!categoryId || !supplierId) {
            alert("Vui lòng chọn danh mục và nhà cung cấp!");
            return;
        }

        let medicineData = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value,
            manufacturer: document.getElementById("manufacturer").value,
            ingredient: document.getElementById("ingredient").value,
            registrationNumber: document.getElementById("registrationNumber").value,
            qualityStandards: document.getElementById("qualityStandards").value,
            shelfLife: document.getElementById("shelfLife").value,
            dosageForm: document.getElementById("dosageForm").value,
            specification: document.getElementById("specification").value,
            origin: document.getElementById("origin").value,
            quantity: document.getElementById("quantity").value,
            categoryMedicineId: categoryId,
            supplierId: supplierId
        };

        let formData = new FormData();
        formData.append("medicine", new Blob([JSON.stringify(medicineData)], { type: "application/json" }));
        let imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        } // Nếu không có ảnh, nó sẽ không được gửi đi


        fetch(`${API_URL}/${medicineId}`, {
            method: "PUT",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(() => window.location.href = "list-medicine")
            .catch(error => console.error("Error updating medicine:", error));
    });
}

// Gọi API khi tải trang danh sách thuốc
if (window.location.pathname.includes("list-medicine")) fetchMedicines();
if (window.location.pathname.includes("index")) fetchMedicinesIndex();








