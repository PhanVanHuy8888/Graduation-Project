package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.CartRequest;
import com.example.graduate_proejct.entity.Cart;
import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.repository.CartRepository;
import com.example.graduate_proejct.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public List<Cart> getCartItems(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user);
    }

    public Cart addToCart(CartRequest cartRequest) {
        System.out.println("Received cart request: " + cartRequest);
        System.out.println("Looking for user with ID: " + cartRequest.getUserId());
        User user = userRepository.findById(cartRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cartItem = cartRepository.findByUserAndMedicineName(user, cartRequest.getMedicineName())
                .orElse(new Cart());

        cartItem.setUser(user);
        cartItem.setMedicineName(cartRequest.getMedicineName());
        cartItem.setPrice(cartRequest.getPrice());
        cartItem.setQuantity(cartItem.getQuantity() != null ? cartItem.getQuantity() + cartRequest.getQuantity() : cartRequest.getQuantity());
        cartItem.setTotal(cartItem.getQuantity() * cartRequest.getPrice());

        return cartRepository.save(cartItem);
    }

    public void removeFromCart(Integer cartId) {
        cartRepository.deleteById(cartId);
    }

    public void clearCart(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepository.deleteAll(cartRepository.findByUser(user));
    }
}
