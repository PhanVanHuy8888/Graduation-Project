package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.entity.Article;
import com.example.graduate_proejct.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestParam("title") String title,
                                                 @RequestParam("description") String description,
                                                 @RequestParam("image") MultipartFile image) throws IOException {
        Article article = new Article();
        article.setTitle(title);
        article.setDescription(description);

        // Gọi service để xử lý việc tạo article và lưu ảnh
        Article savedArticle = articleService.createArticle(article, image);
        return ResponseEntity.ok(articleService.createArticle(savedArticle, image));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id,
                                                 @RequestParam("title") String title,
                                                 @RequestParam("description") String description,
                                                 @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Article articleDetails = new Article();
        articleDetails.setTitle(title);
        articleDetails.setDescription(description);


        Article updatedArticle = articleService.updateArticle(id, articleDetails, image);
        return ResponseEntity.ok(updatedArticle);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Integer id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok("Article deleted successfully");
    }

    @PostMapping("/ckfinder/connector")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("upload") MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("src/main/resources/static/uploads/");
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, Object> response = new HashMap<>();
            response.put("uploaded", 1);
            response.put("fileName", filename);
            response.put("url", "/uploads/" + filename);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "uploaded", 0,
                    "error", Map.of("message", "Lỗi upload ảnh.")
            ));
        }
    }


}

