const API_URL = "http://localhost:8080/api/medicines";
const CATEGORY_API = "http://localhost:8080/api/category-medicine";
const CART_API = "http://localhost:8080/api/cart";
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
                <div class="card">
                    <a href="/detail-medicine?id=${medicine.id}" class="text-decoration-none text-dark">
                        <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                            <img class="w-100" src="${medicine.image}" alt="${medicine.name}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title mb-3">${medicine.name}</h5>
                            <p>${medicine.categoryMedicine.categoryMedicineName}</p>
                            <h6 class="mb-3">
                                <span class="text-black rounded-pill py-2 px-3 font-weight-bold">
                                    ${formattedPrice}
                                </span>
                            </h6>
                        </div>
                    </a>
                    <button class="btn btn-primary" onclick="addToCart('${medicine.name}', ${medicine.price})">
                        Chọn mua
                    </button>
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
async function addToCart(medicineName, price, quantity = 1) {
    let userId = localStorage.getItem("userId"); // Lấy userId từ localStorage

    // Kiểm tra nếu trên trang chi tiết sản phẩm, lấy số lượng từ input
    const quantityInput = document.getElementById("inputQuantity");
    if (quantityInput) {
        quantity = parseInt(quantityInput.value) || 1;
    }

    console.log("Adding to cart:", { userId, medicineName, price, quantity });

    const cartItem = {
        medicineName: medicineName,
        price: price,
        quantity: quantity
    };

    if (userId) {
        // 🟢 Có userId -> Gửi API để lưu vào database
        try {
            const response = await fetch(CART_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, ...cartItem })
            });

            const result = await response.json();
            console.log("Response:", result);
            alert(result.message);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Lỗi khi thêm vào giỏ hàng!");
        }
    } else {
        //  Không có userId -> Lưu vào localStorage
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng -> Cộng dồn số lượng
        const existingItem = cart.find(item => item.medicineName === medicineName);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }

        // Lưu lại vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Sản phẩm đã được thêm vào giỏ hàng");
    }
}



// End add Cart

// Xóa thuốc
async function deleteMedicine(id) {
    if (confirm("Bạn có chắc chắn muốn xóa thuốc này?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
            if (!response.ok) {
                throw new Error("Lỗi khi xóa thuốc!");
            }
            alert("Xóa thuốc thành công!");
            fetchMedicines();
        } catch (error) {
            console.error("Error deleting medicine:", error);
            alert("Không thể xóa thuốc! Có thể thuốc này đang được sử dụng.");
        }
    }
}


// Thêm thuốc
if (window.location.pathname.includes("/add-medicine")) {
    fetchCategoriesAndSuppliers();

    document.getElementById("addMedicineForm").addEventListener("submit", function (event) {
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
        formData.append("medicine", new Blob([JSON.stringify(medicineData)], {type: "application/json"}));

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
                    return response.text().then(text => {
                        throw new Error(text)
                    });
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
        formData.append("medicine", new Blob([JSON.stringify(medicineData)], {type: "application/json"}));
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
                    return response.text().then(text => {
                        throw new Error(text)
                    });
                }
                return response.json();
            })
            .then(() => window.location.href = "list-medicine")
            .catch(error => console.error("Error updating medicine:", error));
    });
}

// Medicine Detail

async function loadMedicineDetails(medicineId) {
    try {
        const response = await fetch(`${API_URL}/${medicineId}`);

        // Kiểm tra phản hồi API
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Kiểm tra nếu API không trả về JSON hợp lệ
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }

        const medicine = await response.json();
        const medicineContainer = document.getElementById('detailMedicine');

        // Xóa nội dung cũ trước khi hiển thị dữ liệu mới
        medicineContainer.innerHTML = '';

        // Định dạng giá bằng JavaScript
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(medicine.price);

        // Tạo HTML hiển thị thông tin sản phẩm
        const medicineCard = document.createElement('div');
        medicineCard.innerHTML = `
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6">
                    <img class="w-100" src="${medicine.image}" alt="${medicine.name}">
                </div>
                <div class="col-md-6">
                    <h1 class="display-5 fw-bolder">${medicine.name}</h1>
                    <div class="fs-5 mb-5">
                        <span>${formattedPrice}</span>
                    </div>
                    <p class="lead">${medicine.description}</p>
                    <div class="d-flex">
                        <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1"
                               style="max-width: 3rem"/>
                        <button class="btn btn-outline-dark flex-shrink-0" type="button" onclick="addToCart('${medicine.name}', ${medicine.price})">
                            <i class="me-1"></i>
                            Chọn mua
                        </button>
                    </div>
                </div>
            </div>
        `;

        medicineContainer.appendChild(medicineCard);
    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        document.getElementById("detailMedicine").textContent = 'Có lỗi xảy ra khi tải dữ liệu';
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const medicineId = new URLSearchParams(window.location.search).get('id');
    if (medicineId) {
        loadMedicineDetails(medicineId);
    }
    fetchProducts(); // Gọi hàm fetchProducts khi trang được load
});

function showAlert() {
    var alertBox = document.getElementById('customAlert');
    alertBox.classList.add('show');
    setTimeout(function () {
        alertBox.classList.remove('show');
    }, 3000);
}

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const medicine = await response.json();
        const medicineContainer = document.getElementById('medicineContainers');

        // Lấy 4 sản phẩm đầu tiên từ danh sách
        const limitedProducts = medicine.slice(0, 4);

        medicine.forEach((medicine) => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('col-lg-4', 'col-md-12', 'mb-4');

            // Định dạng giá bằng JavaScript
            const formattedPrice = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(medicine.price);

            // Rút gọn tên sản phẩm nếu cần
            const truncatedName = medicine.name.length > 20 ? medicine.name.substring(0, 20) + '...' : medicine.name;

            medicineCard.innerHTML = `
                <div class="card">
                    <a href="/detail-medicine?id=${medicine.id}" class="text-decoration-none text-dark">
                        <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light" data-mdb-ripple-color="light">
                            <img class="w-100" src="${medicine.image}" alt="${medicine.name}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title mb-3">${truncatedName}</h5>
                            <p>${medicine.categoryMedicine.categoryMedicineName}</p>
                            <h6 class="mb-3">
                                <span class="text-black rounded-pill py-2 px-3 font-weight-bold">
                                    ${formattedPrice}
                                </span>
                            </h6>
                        </div>
                    </a>
                    <button class="btn btn-primary" onclick="addToCart('${medicine.name}', ${medicine.price})">
                        Chọn mua
                    </button>
                </div>
            `;

            medicineContainer.appendChild(medicineCard);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Gọi API khi tải trang danh sách thuốc
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("list-medicine")) fetchMedicines();
    if (window.location.pathname.includes("index") || window.location.pathname === "/") fetchMedicinesIndex();
});




