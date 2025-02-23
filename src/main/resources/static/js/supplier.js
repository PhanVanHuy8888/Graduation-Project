const API_URL = "http://localhost:8080/api/supplier";

// Fetch danh sách supplier
function fetchSupplier() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("supplierTable");
            tableBody.innerHTML = "";
            data.forEach((supplier,index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${supplier.supplierName}</td>
                    <td>${supplier.address}</td>
                    <td>${supplier.phoneNumber}</td>
                    <td>
                        <a class="btn btn-warning" href="edit-supplier?id=${supplier.id}">Edit</a>
                        <button class="btn btn-danger" onclick="deleteSupplier(${supplier.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

// Xóa supplier
function deleteSupplier(id) {
    if (confirm("Are you sure you want to delete this supplier?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => fetchSupplier());
    }
}

// Thêm supplier
document.getElementById("supplierForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    let supplierName = document.getElementById("supplierName").value;
    let address = document.getElementById("address").value;
    let phoneNumber = document.getElementById("phoneNumber").value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierName, address, phoneNumber })
    }).then(() => {
        window.location.href = "/list-supplier";
    });
});

// Load dữ liệu để chỉnh sửa
if (window.location.pathname.includes("/edit-supplier")) {
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get("id");

    fetch(`${API_URL}/${supplierId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("supplierId").value = data.id;
            document.getElementById("supplierName").value = data.supplierName;
            document.getElementById("address").value = data.address;
            document.getElementById("phoneNumber").value = data.phoneNumber;
        });

    document.getElementById("editSupplierForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let supplierName = document.getElementById("supplierName").value;
        let address = document.getElementById("address").value;
        let phoneNumber = document.getElementById("phoneNumber").value;

        fetch(`${API_URL}/${supplierId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ supplierName, address, phoneNumber })
        }).then(() => {
            window.location.href = "/list-supplier";
        });
    });
}

// Load danh sách khi vào trang list.html
if (document.getElementById("supplierTable")) {
    fetchSupplier();
}
