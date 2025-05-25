const USER_API = "/api/users";
const ROLE_API = "/roles/list";

// Lấy id user từ URL
function getUserIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load danh sách roles
function loadRoles() {
    return fetch(ROLE_API)
        .then(res => res.json())
        .then(data => {
            const roleSelect = document.getElementById("roles");
            roleSelect.innerHTML = "";
            data.forEach(role => {
                const option = document.createElement("option");
                option.value = role.name;
                option.text = role.name;
                roleSelect.appendChild(option);
            });
        });
}

// Lấy dữ liệu user theo id
function fetchUserById(id) {
    return fetch(`${USER_API}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Không lấy được dữ liệu user");
            return res.json();
        });
}

// Điền dữ liệu user vào form
function fillForm(user) {
    const genderValue = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : 'Nam';

    document.getElementById('userId').value = user.id || '';
    document.getElementById('userName').value = user.userName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('address').value = user.address || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('birthday').value = user.birthday ? user.birthday.split('T')[0] : '';
    document.getElementById('gender').value = (genderValue === "Nam" || genderValue === "Nữ") ? genderValue : "Nam";

    // Chọn roles tương ứng
    const rolesSelect = document.getElementById('roles');
    if (user.roles && user.roles.length) {
        Array.from(rolesSelect.options).forEach(option => {
            option.selected = user.roles.includes(option.value);
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadRoles(); // Đợi load roles xong mới load user để set roles đúng
        const userId = getUserIdFromUrl();
        const user = await fetchUserById(userId);
        fillForm(user);
    } catch (error) {
        alert(error.message);
    }
});



document.getElementById("userForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("userId").value;
    if (!id) {
        alert("Không tìm thấy ID người dùng!");
        return;
    }

    const selectedRoles = Array.from(document.getElementById("roles").selectedOptions)
        .map(option => option.value);

    const user = {
        userName: document.getElementById("userName").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        birthday: document.getElementById("birthday").value,
        gender: document.getElementById("gender").value,
        password: document.getElementById("password").value,
        roles: selectedRoles
    };

    try {
        const response = await fetch(`${USER_API}/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi khi cập nhật người dùng");
        }
        alert("Cập nhật người dùng thành công!");
        window.location.href = "/list-user";
    } catch (err) {
        alert(err.message);
    }
});