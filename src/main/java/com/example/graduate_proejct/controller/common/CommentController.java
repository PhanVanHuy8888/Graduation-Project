package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{medicineId}")
    public ResponseEntity<?> addComment(
            @PathVariable Integer medicineId,
            @RequestBody Map<String, Object> payload) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || (auth.getPrincipal() instanceof String)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();
        String content = (String) payload.get("content");
        int rating = (int) payload.getOrDefault("rating", 5);

        return commentService.addComment(medicineId, content, rating, email);
    }

    @GetMapping("/{medicineId}")
    public ResponseEntity<List<Map<String, Object>>> getComments(@PathVariable Integer medicineId) {
        return ResponseEntity.ok(commentService.getComments(medicineId));
    }

    @GetMapping("/average-rating/{medicineId}")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Integer medicineId) {
        return ResponseEntity.ok(commentService.getAverageRating(medicineId));
    }
}
