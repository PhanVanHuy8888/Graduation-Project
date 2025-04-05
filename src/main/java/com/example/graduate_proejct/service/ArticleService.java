package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Article;
import com.example.graduate_proejct.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    private static final String IMAGE_DIRECTORY = "src/main/resources/static/img/";


    public Article createArticle(Article article, MultipartFile image) throws IOException {
        // Lưu ảnh và lấy đường dẫn ảnh
        String imagePath = saveImage(image);

        // Gán đường dẫn ảnh vào đối tượng article
        article.setImage(imagePath);

        // Lưu article vào cơ sở dữ liệu
        return articleRepository.save(article);
    }

    public Article getArticleById(Integer id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article updateArticle(Integer id, Article articleDetails, MultipartFile image) throws IOException {
        // Lấy bài viết hiện tại
        Article article = getArticleById(id);

        // Cập nhật các trường text
        article.setTitle(articleDetails.getTitle());
        article.setDescription(articleDetails.getDescription());

        // Nếu có ảnh mới, lưu ảnh mới và cập nhật trường image
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);  // Lưu ảnh mới
            article.setImage(imagePath);  // Cập nhật đường dẫn ảnh
        }

        // Lưu lại bài viết đã cập nhật
        return articleRepository.save(article);
    }



    public void deleteArticle(Integer id) {
        articleRepository.deleteById(id);
    }

    private String saveImage(MultipartFile image) throws IOException {
        // Tạo tên ảnh duy nhất
        String imageName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
        Path imagePath = Path.of(IMAGE_DIRECTORY, imageName);

        // Lưu ảnh vào thư mục static/img/
        Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        return "/img/" + imageName;  // Trả về đường dẫn ảnh có thể truy cập được
    }
}

