
// Fetch and display the articles
function fetchArticles() {
    fetch('/api/articles')
        .then(response => response.json())
        .then(data => {
            const articleList = document.getElementById('article-list');
            articleList.innerHTML = ''; // Clear existing content

            data.forEach((article, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${article.title.length > 10 ? article.title.substring(0, 10) + '...' : article.title}</td>
                            <td><img src="${article.image}" alt="default.jpg" style="width: 50px; height: auto;"></td>
                            <td>${article.description.length > 10 ? article.description.substring(0, 10) + '...' : article.description}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="showUpdateModal(${article.id}, '${article.title}', '${article.description}')">Update</button>
                                <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${article.id})">Delete</button>
                            </td>
                        `;
                articleList.appendChild(row);
            });
        });
}

// Show the Add New Article Modal
document.getElementById('add-article-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addNewArticle();
});

// Add new article
function addNewArticle() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    fetch('/api/articles', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(() => {
            fetchArticles();
            $('#addArticleModal').modal('hide');
        });
}

// Show the Update Modal with article details
function showUpdateModal(id, title, description) {
    $('#update-title').val(title);
    $('#update-description').val(description);
    $('#update-article-form').off('submit').on('submit', function(event) {
        event.preventDefault();
        updateArticle(id);
    });
    $('#updateArticleModal').modal('show');
}

// Update article
function updateArticle(id) {
    const title = $('#update-title').val();
    const description = $('#update-description').val();
    const image = $('#update-image')[0].files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    fetch(`/api/articles/${id}`, {
        method: 'PUT',
        body: formData // This automatically sets the Content-Type to multipart/form-data
    })
        .then(response => response.json())
        .then(() => {
            fetchArticles();
            $('#updateArticleModal').modal('hide');
        })
        .catch(error => console.error("Error during update:", error));
}

// Show Delete Confirmation Modal
function showDeleteModal(id) {
    $('#confirm-delete').off('click').on('click', function() {
        deleteArticle(id);
    });
    $('#deleteArticleModal').modal('show');
}

// Delete article
function deleteArticle(id) {
    fetch(`/api/articles/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            fetchArticles();
            $('#deleteArticleModal').modal('hide');
        });
}

// Fetch articles on page load
document.addEventListener('DOMContentLoaded', fetchArticles);

let editorInstance;
ClassicEditor.create(document.querySelector('#description'), {
    extraPlugins: [ MyCustomUploadAdapterPlugin ],
    language: 'vi',
    toolbar: [ 'heading', '|', 'bold', 'italic', 'imageUpload', 'undo', 'redo' ]
}).then(editor => {
    editorInstance = editor;
}).catch(error => {
    console.error(error);
});

// Upload Adapter
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(file => {
            const data = new FormData();
            data.append('upload', file);

            return fetch('/api/articles/ckfinder/connector', {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(res => ({
                    default: res.url // trả về URL ảnh sau upload
                }));
        });
    }

    abort() {
        // bỏ qua
    }
}


// Gửi form thêm bài viết
document.getElementById('add-article-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = editorInstance.getData().trim(); // lấy nội dung CKEditor
    const image = document.getElementById('image').files[0];

    if (!title || !description || !image) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
        const response = await fetch('/api/articles', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Thêm bài viết thành công!');
            location.reload();
        } else {
            alert('Thêm thất bại!');
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi kết nối server!');
    }
});
