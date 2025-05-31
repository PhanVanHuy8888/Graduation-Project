const API_URLS = "/api/medicines/getMede";
const API_URL = "/api/medicines";
const CATEGORY_API = "/api/category-medicine";
const CART_API = "/api/cart";
const SUPPLIER_API = "/api/supplier";
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
function fetchMedicines(page = 0, size = 5) {

    fetch(`${API_URL}?page=${page}&size=${size}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("medicineTable");
            tableBody.innerHTML = "";

            const medicines = data.medicines;
            const totalPages = data.totalPages;

            medicines.forEach((medicine, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1 + (page * size)}</td>
                    <td>${medicine.name}</td>
                    <td>
                        <img src="${medicine.image}" width="150" alt="${medicine.image}" onerror="this.onerror=null;this.src='default.jpg';">
                    </td>
                    <td>${medicine.price}đ</td>
                    <td>
                        <a class="badge badge-outline-warning" href="edit-medicine?id=${medicine.id}">Sửa</a>
                        <a class="badge badge-outline-info" href="#" onclick='viewMedicine(${JSON.stringify(medicine)})'>Xem</a>
                        <button class="badge badge-outline-danger" onclick="deleteMedicine(${medicine.id})">Xoá</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            displayPagination(page, totalPages);
        })
        .catch(error => console.error("Error fetching medicines:", error));
}


function viewMedicine(medicine) {
    document.getElementById("medicineImage").src = medicine.image;
    document.getElementById("medicineName").textContent = medicine.name;
    document.getElementById("medicinePrice").textContent = medicine.price + " VND";
    document.getElementById("medicineDescription").textContent = medicine.description;
    document.getElementById("medicineManufacturer").textContent = medicine.manufacturer;
    document.getElementById("medicineIngredient").textContent = medicine.ingredient;
    document.getElementById("medicineRegistrationNumber").textContent = medicine.registrationNumber;
    document.getElementById("medicineShelfLife").textContent = medicine.shelfLife;
    document.getElementById("medicineDosageForm").textContent = medicine.dosageForm;
    document.getElementById("medicineQuantity").textContent = medicine.quantity;
    document.getElementById("medicineSpecification").textContent = medicine.specification;
    document.getElementById("medicineOrigin").textContent = medicine.origin;
    document.getElementById("medicineMeasurement").textContent = medicine.measurement;
    document.getElementById("medicineUsageOfMedicine").textContent = medicine.usageOfMedicine;
    document.getElementById("medicineNote").textContent = medicine.note;
    document.getElementById("medicinePreservation").textContent = medicine.preservation;
    document.getElementById("medicineSideEffects").textContent = medicine.sideEffects;
    document.getElementById("medicineUseOfMedicine").textContent = medicine.useOfMedicine;

    // Mở modal bằng JavaScript thuần
    let modal = new bootstrap.Modal(document.getElementById("medicineModal"));
    modal.show();
}


document.addEventListener("DOMContentLoaded", fetchMedicines);


async function fetchMedicinesIndex(page = 0, size = 6) {
    try {
        // Gửi yêu cầu đến API với tham số phân trang
        const response = await fetch(`${API_URL}?page=${page}&size=${size}`);
        const data = await response.json();

        const medicines = data.medicines;
        const totalItems = data.totalItems;
        const totalPages = data.totalPages;

        const medicineContainer = document.getElementById('medicineContainer');
        medicineContainer.innerHTML = ""; // Xóa nội dung cũ

        // Hiển thị các sản phẩm
        medicines.forEach((medicine) => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('col-lg-4', 'col-md-12', 'mb-4');

            // Định dạng giá
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
                            <h5 class="card-title mb-3" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${medicine.name}
                            </h5>
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

        // Hiển thị phân trang
        displayPagination(page, totalPages);

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


function displayPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ""; // Xóa phân trang cũ

    for (let i = 0; i < totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i + 1;
        button.classList.add("btn", "btn-outline-primary", "mx-1");

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => fetchMedicinesIndex(i)); // ✅ TRUYỀN i, KHÔNG PHẢI event
        paginationContainer.appendChild(button);
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
    const userId = localStorage.getItem("userId");

    // Kiểm tra số lượng nếu cần thiết từ API
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            console.error("Lỗi khi lấy dữ liệu từ API, mã lỗi:", response.status);
            alert("Lỗi khi lấy dữ liệu sản phẩm.");
            return;
        }

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Lỗi khi phân tích cú pháp JSON:", e);
            alert("Dữ liệu không phải là JSON.");
            return;
        }

        if (!data.medicines || !Array.isArray(data.medicines)) {
            console.error("Dữ liệu không hợp lệ, thiếu mảng medicines.");
            alert("Dữ liệu sản phẩm không hợp lệ.");
            return;
        }

        const medicine = data.medicines.find(med => med.name === medicineName);
        if (!medicine) {
            alert("Sản phẩm không tồn tại!");
            return;
        }

        if (medicine.quantity === 0) {
            alert("Sản phẩm hết hàng!");
            return;
        }

        const quantityInput = document.getElementById("inputQuantity");
        if (quantityInput) {
            quantity = parseInt(quantityInput.value) || 1;
        }

        const cartItem = {
            medicineName: medicineName,
            price: price,
            quantity: quantity
        };

        if (userId) {
            // Người dùng đã đăng nhập, gửi lên server
            const cartResponse = await fetch(CART_API, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userId, ...cartItem})
            });

            const result = await cartResponse.json();
            console.log("Response:", result);
            alert(result.message);
        } else {
            // Người dùng chưa đăng nhập, lưu vào localStorage
            let localCart = JSON.parse(localStorage.getItem("guestCart")) || [];

            // Nếu sản phẩm đã có trong giỏ thì cộng dồn
            const existingItem = localCart.find(item => item.medicineName === medicineName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.push(cartItem);
            }

            localStorage.setItem("guestCart", JSON.stringify(localCart));
            alert("Đã thêm sản phẩm vào giỏ hàng (chưa đăng nhập).");
        }

    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Lỗi khi thêm vào giỏ hàng!");
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
            shelfLife: document.getElementById("shelfLife").value,
            dosageForm: document.getElementById("dosageForm").value,
            specification: document.getElementById("specification").value,
            origin: document.getElementById("origin").value,
            measurement: document.getElementById("measurement").value,
            quantity: document.getElementById("quantity").value,
            usageOfMedicine: document.getElementById("usageOfMedicine").value,
            note: document.getElementById("note").value,
            preservation: document.getElementById("preservation").value,
            sideEffects: document.getElementById("sideEffects").value,
            useOfMedicine: document.getElementById("useOfMedicine").value,
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
                document.getElementById("shelfLife").value = data.shelfLife;
                document.getElementById("dosageForm").value = data.dosageForm;
                document.getElementById("specification").value = data.specification;
                document.getElementById("origin").value = data.origin;
                document.getElementById("measurement").value = data.measurement;
                document.getElementById("medicineUsageOfMedicine").value = data.usageOfMedicine;
                document.getElementById("medicineNote").value = data.note;
                document.getElementById("medicinePreservation").value = data.preservation;
                document.getElementById("medicineSideEffects").value = data.sideEffects;
                document.getElementById("medicineUseOfMedicine").value = data.useOfMedicine;
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
            shelfLife: document.getElementById("shelfLife").value,
            dosageForm: document.getElementById("dosageForm").value,
            specification: document.getElementById("specification").value,
            origin: document.getElementById("origin").value,
            measurement: document.getElementById("measurement").value,
            quantity: document.getElementById("quantity").value,
            usageOfMedicine: document.getElementById("usageOfMedicine").value,
            note: document.getElementById("note").value,
            preservation: document.getElementById("preservation").value,
            sideEffects: document.getElementById("sideEffects").value,
            useOfMedicine: document.getElementById("useOfMedicine").value,
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
            <div>
                <div style="border-radius: 15px;" class="bg-white rounded-5 shadow-sm p-5">
                    <div class="row gx-4 gx-lg-5 ">
                        <div class="col-md-6">
                            <img class="w-100 rounded-3" src="${medicine.image}" alt="${medicine.name}">
                        </div>
                        <div class="col-md-6">
                            <h5 class="fs-4">${medicine.name}</h5>
                            <div class="fs-5 mb-3">
                                <span>${formattedPrice}/${medicine.measurement}</span>
                            </div>
                            <div class="row mb-2 align-items-start">
                                <div class="col-md-5"><p class="mb-0">Xuất xứ thương hiệu</p></div>
                                <div class="col-md-7"><p class="mb-0">${medicine.manufacturer}</p></div>
                            </div>
                            <div class="row mb-2 align-items-start">
                                <div class="col-md-5"><p class="mb-0">Quy cách</p></div>
                                <div class="col-md-7"><p class="mb-0">${medicine.specification}</p></div>
                            </div>
                            <div class="row mb-2 align-items-start">
                                <div class="col-md-5"><p class="mb-0">Danh mục</p></div>
                                <div class="col-md-7"><p class="mb-0">${medicine.categoryMedicine.categoryMedicineName}</p></div>
                            </div>
                            <div class="d-flex">
                                <input class="form-control text-center me-3" id="inputQuantity" type="number" value="1"
                                       style="max-width: 3rem"/>
                                <button class="btn btn-outline-dark btn-success flex-shrink-0" type="button" onclick="addToCart('${medicine.name}', ${medicine.price})">
                                    <i class="me-1"></i>
                                    Chọn mua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="border-radius: 15px;" class="bg-white rounded-4 shadow-sm mt-4 p-5">
                <div class="row gx-4 gx-lg-5">
                     <h5>Thông số và mô tả</h5>
                     <div class="container">
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Thành phần</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.ingredient}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Số đăng ký</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.registrationNumber}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Công dụng</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.useOfMedicine}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Cách dùng</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.usageOfMedicine}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Tác dụng phụ</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.sideEffects}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Lưu ý</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.note}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Bảo quản</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.preservation}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Hạn sử dụng</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.shelfLife}</p></div>
                        </div>
                    
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Dạng bào chế</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.dosageForm}</p></div>
                        </div>
                        <div class="row mb-2 align-items-start">
                            <div class="col-md-2"><p class="mb-0"><strong>Mô tả</strong></p></div>
                            <div class="col-md-10"><p class="mb-0">${medicine.description}</p></div>
                        </div>
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


async function fetchProducts(page = 0, size = 3) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&size=${size}`);
        const data = await response.json();

        const medicineContainer = document.getElementById('medicineContainers');
        medicineContainer.innerHTML = "";

        const medicines = data.medicines;
        const totalPages = data.totalPages;

        medicines.forEach((medicine) => {
            const medicineCard = document.createElement('div');
            medicineCard.classList.add('col-lg-4', 'col-md-12', 'mb-4');

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
                            <h5 class="card-title mb-3" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${medicine.name}
                            </h5>
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

        displayPagination(page, totalPages);

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Gọi API khi tải trang danh sách thuốc
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("list-medicine")) {
        fetchMedicines(); // Trang danh sách thuốc cho admin
    } else if (path.includes("index") || path === "/") {
        fetchMedicinesIndex(); // Trang chủ hoặc index
    }
});


// window.addEventListener("load", function () {
//     localStorage.clear();
//     console.log("LocalStorage đã được xóa khi tải trang.");
// });





