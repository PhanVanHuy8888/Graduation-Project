async function fetchCategory() {
    console.log("fetchCategory function is called!"); // Log kiểm tra

    try {
        const response = await fetch("/api/categories");
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

window.onload = function () {
    fetchCategory();
    loadContacts();
};

document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn form reload trang

    const contact = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            const result = await response.json();
            alert("Cảm ơn bạn! Thông tin đã được gửi.");
            document.getElementById("contactForm").reset();
        } else {
            const errorText = await response.text();
            alert("Lỗi khi gửi: " + errorText);
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Không thể gửi liên hệ. Vui lòng thử lại sau.");
    }
});

async function loadContacts() {
    try {
        const response = await fetch("/api/contact"); // Hoặc đúng endpoint của bạn
        const contacts = await response.json();

        const tbody = document.getElementById("contactTable");
        tbody.innerHTML = "";

        contacts.forEach((contact, index) => {
            const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${contact.fullName}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phoneNumber}</td>
                        <td>${contact.message}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteContact(${contact.id})">
                                Delete
                            </button>
                        </td>
                    </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading contacts:", error);
    }
}

async function deleteContact(id) {
    if (!confirm("Bạn có chắc muốn xoá liên hệ này?")) return;

    try {
        const response = await fetch(`/api/contact/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Đã xoá thành công!");
            loadContacts(); // Refresh list
        } else {
            alert("Lỗi khi xoá liên hệ!");
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

// Tự động load khi trang vừa vào
window.onload = loadContacts;