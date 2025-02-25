package com.example.graduate_proejct.controller.user;

import com.example.graduate_proejct.dto.request.CartRequest;
import com.example.graduate_proejct.entity.Cart;
import com.example.graduate_proejct.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Cart>> getCartItems(@PathVariable String userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping()
    public ResponseEntity<Map<String, String>> addToCart(@RequestBody CartRequest cartRequest) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Added to cart successfully!");
        cartService.addToCart(cartRequest);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer cartId) {
        cartService.removeFromCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
