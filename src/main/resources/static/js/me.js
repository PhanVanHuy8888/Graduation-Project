const API_URL = "/api/medicines";
const API_CATEGORY = "/api/category-medicine";

// Tải danh sách thuốc (toàn bộ hoặc theo category)
async function fetchMedicines(categoryId = null, page = 0) {
    try {
        const url = categoryId
            ? `${API_URL}?categoryId=${categoryId}&page=${page}`
            : `${API_URL}?page=${page}`;
        const response = await fetch(url);
        const result = await response.json();

        const medicines = result.medicines;
        const totalPages = result.totalPages;
        const currentPage = result.currentPage;

        const medicineContainer = document.getElementById('medicineContainer');
        medicineContainer.innerHTML = "";

        medicines.forEach((medicine) => {
            const formattedPrice = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(medicine.price);

            const medicineCard = document.createElement('div');
            medicineCard.classList.add('col-lg-4', 'col-md-6', 'mb-4');
            medicineCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <a href="/detail-medicine?id=${medicine.id}" class="text-decoration-none text-dark">
                        <img class="card-img-top" src="${medicine.image}" alt="${medicine.name}">
                        <div class="card-body">
                            <h5 class="card-title">${medicine.name}</h5>
                            <p class="text-muted">${medicine.categoryMedicine.categoryMedicineName}</p>
                            <h6 class="text-primary font-weight-bold">${formattedPrice}</h6>
                        </div>
                    </a>
                    <div class="card-footer text-center">
                        <button class="btn btn-success w-100" onclick="addToCart('${medicine.name}', ${medicine.price})">
                            Chọn mua
                        </button>
                    </div>
                </div>
            `;
            medicineContainer.appendChild(medicineCard);
        });

        renderPagination(totalPages, currentPage, categoryId);
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
    }
}


async function fetchCategories() {
    try {
        const response = await fetch(API_CATEGORY);
        const categories = await response.json();
        const list = document.getElementById("categoryMedicineList");
        list.innerHTML = "";

        const allItem = document.createElement("li");
        allItem.className = "list-group-item";
        allItem.innerHTML = `<span class="text-dark" style="cursor:pointer;">Tất cả</span>`;
        allItem.onclick = () => fetchMedicines();
        list.appendChild(allItem);

        categories.forEach(category => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `<span class="text-dark" style="cursor:pointer;">${category.categoryMedicineName}</span>`;
            li.onclick = () => fetchMedicines(category.id);
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Lỗi khi tải danh mục thuốc:", error);
    }
}

async function fetchCategory() {
    console.log("fetchCategory function is called!"); // Log kiểm tra

    try {
        const response = await fetch("http://localhost:8080/api/categories");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched categories:", data); // Kiểm tra dữ liệu trả về

        const categoryList = document.getElementById("categoryList");
        if (!categoryList) {
            console.error("Element #categoryList not found!");
            return;
        }

        categoryList.innerHTML = ""; // Xóa danh sách cũ

        data.forEach(category => {
            const listItem = document.createElement("li");
            listItem.classList.add("nav-item");

            listItem.innerHTML = `
                    <a class="nav-link" href="/${category.url}">
                        ${category.categoryName}
                    </a>
                `;

            categoryList.appendChild(listItem);
        });

        console.log("Categories rendered successfully!");
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

function renderPagination(totalPages, currentPage, categoryId) {
    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.classList.add("btn", "btn-sm", "me-1", i === currentPage ? "btn-primary" : "btn-outline-primary");
        pageBtn.innerText = i + 1;
        pageBtn.onclick = () => fetchMedicines(categoryId, i);
        paginationContainer.appendChild(pageBtn);
    }
}


window.onload = function () {
    fetchCategory();
};

// Tải dữ liệu khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchMedicines();
});

// Hàm thêm sản phẩm vào giỏ hàng (demo)
function addToCart(name, price) {
    alert(`Đã thêm "${name}" - Giá: ${price} vào giỏ hàng (demo)!`);
}