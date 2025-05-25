const ROLE_API = "/roles/list";
const USER_API = "/api/users";


document.addEventListener("DOMContentLoaded", async () => {
    await loadRoles();
});
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

document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

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

    fetch(USER_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi khi lưu người dùng");
            }
            return response.json();
        })
        .then(() => {
            window.location.href = "/list-user";
        })
        .catch(err => alert(err.message));
});
