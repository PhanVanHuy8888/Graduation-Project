package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Comment;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.repository.CommentRepository;
import com.example.graduate_proejct.repository.MedicineRepository;
import com.example.graduate_proejct.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    private final MedicineRepository medicineRepository;

    private final UserRepository userRepository;

    public ResponseEntity<?> addComment(Integer medicineId, String content, int rating, String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Medicine medicine = medicineRepository.findById(medicineId).orElse(null);
        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setMedicine(medicine);
        comment.setContent(content);
        comment.setRating(rating);

        commentRepository.save(comment);
        return ResponseEntity.ok().build();
    }

    public List<Map<String, Object>> getComments(Integer medicineId) {
        List<Comment> comments = commentRepository.findByMedicineId(medicineId);

        return comments.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("username", c.getUser().getUserName());
            map.put("content", c.getContent());
            map.put("rating", c.getRating());
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getAverageRating(Integer medicineId) {
        List<Comment> comments = commentRepository.findByMedicineId(medicineId);
        double avg = comments.stream().mapToInt(Comment::getRating).average().orElse(0);
        int count = comments.size();

        Map<String, Object> result = new HashMap<>();
        result.put("average", avg);
        result.put("count", count);
        return result;
    }
}

