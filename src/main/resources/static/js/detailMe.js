
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
};

document.addEventListener("DOMContentLoaded", () => {
    const medicineId = getMedicineIdFromUrl(); // Tự viết hàm lấy id từ URL

    loadComments(medicineId);
    loadAverageRating(medicineId);

    const stars = document.querySelectorAll("#starRating .fa-star");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            const value = parseInt(star.getAttribute("data-value"));
            document.getElementById("selectedRating").value = value;

            stars.forEach(s => s.classList.remove("selected"));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add("selected");
            }
        });
    });

    document.getElementById("commentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("commentContent").value;
        const rating = parseInt(document.getElementById("selectedRating").value);

        const res = await fetch(`/api/comments/${medicineId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, rating })
        });

        if (res.ok) {
            loadComments(medicineId);
            loadAverageRating(medicineId);
            document.getElementById("commentContent").value = "";
            document.getElementById("selectedRating").value = 5;
            stars.forEach((s, i) => s.classList.toggle("selected", i < 5));
        }
    });
});

function getMedicineIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

async function loadComments(medicineId) {
    const res = await fetch(`/api/comments/${medicineId}`);
    const data = await res.json();

    const commentList = document.getElementById("commentList");
    commentList.innerHTML = "";

    data.forEach(c => {
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fa fa-star${i <= c.rating ? ' text-warning' : ' text-muted'}"></i>`;
        }

        const div = document.createElement("div");
        div.className = "mt-3 ml-4 mb-2 border-bottom pb-2";
        div.innerHTML = `<strong>${c.username}</strong>: ${starsHtml}<br/>${c.content}`;
        commentList.appendChild(div);
    });
}

async function loadAverageRating(medicineId) {
    const res = await fetch(`/api/comments/average-rating/${medicineId}`);
    const data = await res.json();

    let starsHtml = "";
    const full = Math.floor(data.average);
    const half = data.average - full >= 0.5;

    for (let i = 1; i <= 5; i++) {
        if (i <= full) starsHtml += `<i class="fa fa-star text-warning"></i>`;
        else if (i === full + 1 && half) starsHtml += `<i class="fa fa-star-half-alt text-warning"></i>`;
        else starsHtml += `<i class="fa fa-star text-muted"></i>`;
    }

    document.getElementById("averageRating").innerHTML = `
        <h5>Đánh giá trung bình:</h5>
        ${starsHtml}
        <span class="ms-2">(${data.average.toFixed(1)} trên ${data.count} đánh giá)</span>
    `;
}
