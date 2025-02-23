const API_URL = "http://localhost:8080/api/medicines";
const CATEGORY_API = "http://localhost:8080/api/category-medicine";
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
        categorySelect.innerHTML = `<option value="">-- Chọn danh mục --</option>`;
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.categoryMedicineName}</option>`;
        });

        // Fetch Supplier
        const supplierResponse = await fetch(SUPPLIER_API);
        const suppliers = await supplierResponse.json();
        let supplierSelect = document.getElementById("supplier");
        supplierSelect.innerHTML = `<option value="">-- Chọn nhà cung cấp --</option>`;
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
                    <td>${medicine.price}</td>
                    <td>${medicine.image}</td>
                    <td>
                        <a class="btn btn-warning" href="edit-medicine?id=${medicine.id}">Edit</a>
                        <button class="btn btn-danger" onclick="deleteMedicine(${medicine.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching medicines:", error));
}

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

        let formData = new FormData();
        formData.append("name", document.getElementById("name").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("manufacturer", document.getElementById("manufacturer").value);
        formData.append("ingredient", document.getElementById("ingredient").value);
        formData.append("registrationNumber", document.getElementById("registrationNumber").value);
        formData.append("qualityStandards", document.getElementById("qualityStandards").value);
        formData.append("shelfLife", document.getElementById("shelfLife").value);
        formData.append("dosageForm", document.getElementById("dosageForm").value);
        formData.append("specification", document.getElementById("specification").value);
        formData.append("origin", document.getElementById("origin").value);
        formData.append("categoryMedicineId", categoryId);
        formData.append("supplierId", supplierId);

        // Xử lý ảnh
        let imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        fetch(API_URL, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(() => window.location.href = "list-medicine")
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
                document.getElementById("categoryMedicine").value = data.categoryMedicine.id;
                document.getElementById("supplier").value = data.supplier.id;
            })
            .catch(error => console.error("Error fetching medicine details:", error));
    });

    document.getElementById("editMedicineForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let medicine = {
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
            categoryMedicine: { id: document.getElementById("categoryMedicine").value },
            supplier: { id: document.getElementById("supplier").value }
        };

        fetch(`${API_URL}/${medicineId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(medicine)
        })
            .then(() => window.location.href = "list-medicine")
            .catch(error => console.error("Error updating medicine:", error));
    });
}

// Gọi API khi tải trang danh sách thuốc
if (window.location.pathname.includes("list-medicine")) fetchMedicines();
