const API_URL = "http://localhost:8080/api/category-medicine";

//  Fetch danh sách category
function fetchCategories() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("categoryTable");
            tableBody.innerHTML = "";
            data.forEach((category, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${category.categoryMedicineName}</td>
                    <td>
                        <a class="btn btn-warning" href="edit-cate-medicine?id=${category.id}">Edit</a>
                        <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

//  Xóa category
function deleteCategory(id) {
    if (confirm("Are you sure you want to delete this Category Medicine?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => fetchCategories());
    }
}

//  Thêm category
document.getElementById("categoryForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    let categoryMedicineName  = document.getElementById("categoryName").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryMedicineName })
    }).then(() => {
        window.location.href = "/list-cate-medicine";
    });
});

// Load dữ liệu để chỉnh sửa
if (window.location.pathname.includes("/edit-cate-medicine")) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("id");

    fetch(`${API_URL}/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("categoryId").value = data.id;
            document.getElementById("categoryName").value = data.categoryMedicineName;
        });

    document.getElementById("editCategoryForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let categoryMedicineName = document.getElementById("categoryName").value;

        fetch(`${API_URL}/${categoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryMedicineName })
        }).then(() => {
            window.location.href = "/list-cate-medicine";
        });
    });
}

// Load danh sách khi vào trang list.html
if (document.getElementById("categoryTable")) {
    fetchCategories();
}
