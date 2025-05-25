
// Handle the search form submit
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const keyword = document.getElementById('searchInput').value.trim();
    if (keyword) {
        fetchMedicines(0, 5, keyword);  // Pass the keyword to the fetchMedicines function
    }
});

// Modify fetchMedicines function to accept keyword
function fetchMedicines(page = 0, size = 5, keyword = "") {
    const url = keyword
        ? `${API_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
        : `${API_URL}?page=${page}&size=${size}`;

    fetch(url)
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
                    <td>${medicine.price}</td>
                    <td>
                        <a class="badge badge-outline-warning" href="edit-medicine?id=${medicine.id}">Edit</a>
                        <a class="badge badge-outline-info" href="#" onclick='viewMedicine(${JSON.stringify(medicine)})'>View</a>
                        <button class="badge badge-outline-danger" onclick="deleteMedicine(${medicine.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            displayPagination(page, totalPages);
        })
        .catch(error => console.error("Error fetching medicines:", error));
}



function displayPagination(currentPage, totalPages) {
    const container = document.getElementById("paginationContainer");
    container.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-light mx-1";
        btn.innerText = i + 1;
        btn.disabled = (i === currentPage);

        btn.addEventListener("click", () => {
            fetchMedicines(i, 5, currentKeyword); // Giữ lại keyword khi phân trang
        });

        container.appendChild(btn);
    }
}


console.log(document.getElementById("medicineTable"));


