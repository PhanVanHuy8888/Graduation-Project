package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.CartRequest;
import com.example.graduate_proejct.entity.Cart;
import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.repository.CartRepository;
import com.example.graduate_proejct.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    public List<Cart> getCartItems(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user);
    }


    public Cart addToCart(CartRequest cartRequest) {
        if (cartRequest.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        logger.info("Received cart request: {}", cartRequest);
        logger.info("Looking for user with ID: {}", cartRequest.getUserId());

        User user = userRepository.findById(cartRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cartItem = cartRepository.findByUserAndMedicineName(user, cartRequest.getMedicineName())
                .orElse(new Cart());

        cartItem.setUser(user);
        cartItem.setMedicineName(cartRequest.getMedicineName());
        cartItem.setPrice(cartRequest.getPrice());

        // Kiểm tra số lượng
        Integer existingQuantity = cartItem.getQuantity() != null ? cartItem.getQuantity() : 0;
        cartItem.setQuantity(existingQuantity + cartRequest.getQuantity());

        // Tính toán tổng tiền
        double total = cartItem.getQuantity() * cartRequest.getPrice();
        cartItem.setTotal(total);

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

    public void updateQuantity(Integer cartItemId, int newQuantity) {
        Cart item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setQuantity(newQuantity);
        cartRepository.save(item);
    }

}
