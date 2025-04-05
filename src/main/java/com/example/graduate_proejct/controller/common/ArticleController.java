package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.entity.Article;
import com.example.graduate_proejct.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
}

