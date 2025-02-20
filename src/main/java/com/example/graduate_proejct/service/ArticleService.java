package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Article;
import com.example.graduate_proejct.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;

    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    public Article getArticleById(Integer id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article updateArticle(Integer id, Article articleDetails) {
        Article article = getArticleById(id);
        article.setTitle(articleDetails.getTitle());
        article.setDescription(articleDetails.getDescription());
        article.setImage(articleDetails.getImage());
        return articleRepository.save(article);
    }

    public void deleteArticle(Integer id) {
        articleRepository.deleteById(id);
    }
}

