const API_URL = "http://localhost:8080/api/categories";

// Fetch danh sách category
function fetchCategories() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("categoryTable");
            tableBody.innerHTML = "";
            data.forEach(category => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.categoryName}</td>
                    <td>
                        <a class="btn btn-warning" href="edit-cate?id=${category.id}">Edit</a>
                        <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

// Xóa category
function deleteCategory(id) {
    if (confirm("Are you sure you want to delete this category?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => fetchCategories());
    }
}

// Thêm category
document.getElementById("categoryForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    let categoryName = document.getElementById("categoryName").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName })
    }).then(() => {
        window.location.href = "/list-cate";
    });
});

// Load dữ liệu để chỉnh sửa
if (window.location.pathname.includes("/edit-cate")) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get("id");

    fetch(`${API_URL}/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("categoryId").value = data.id;
            document.getElementById("categoryName").value = data.categoryName;
        });

    document.getElementById("editCategoryForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let categoryName = document.getElementById("categoryName").value;

        fetch(`${API_URL}/${categoryId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryName })
        }).then(() => {
            window.location.href = "/list-cate";
        });
    });
}

// Load danh sách khi vào trang list.html
if (document.getElementById("categoryTable")) {
    fetchCategories();
}
