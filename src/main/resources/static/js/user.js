async function loadUsers() {
    try {
        const response = await fetch("/api/users/listUser");
        const users = await response.json();

        const tbody = document.getElementById("userTableBody");
        tbody.innerHTML = "";

        users.forEach((user, index) => {
            const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.userName}</td>
                        <td>${user.email}</td>
                        <td>${user.address}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

async function deleteUser(id) {
    console.log("Deleting user id:", id);
    if (!confirm("Bạn có chắc muốn xoá người dùng này?")) return;

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Đã xoá thành công!");
            loadUsers();
        } else {
            alert("Lỗi xoá người dùng!");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

window.onload = loadUsers;