package com.example.graduate_proejct.service;

import com.example.graduate_proejct.entity.Cart;
import com.example.graduate_proejct.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart getCartById(Integer id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    public Cart updateCart(Integer id, Cart cartDetails) {
        Cart cart = getCartById(id);
        cart.setMedicineName(cartDetails.getMedicineName());
        cart.setPrice(cartDetails.getPrice());
        cart.setTotal(cartDetails.getTotal());
        cart.setQuantity(cartDetails.getQuantity());
        return cartRepository.save(cart);
    }

    public void deleteCart(Integer id) {
        cartRepository.deleteById(id);
    }
}
