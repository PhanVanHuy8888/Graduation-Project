package com.example.graduate_proejct.controller.user;

import com.example.graduate_proejct.entity.User;
import com.example.graduate_proejct.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class IndexController {
    private final UserRepository userRepository;

    @GetMapping("/index")
    public String index(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Giả sử bạn có UserRepository để tìm user theo username
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            model.addAttribute("username", username);
            model.addAttribute("userId", user.getId());  // Gửi userId đến frontend
            System.out.println(user.getId());
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }

        return "views/index";
    }

    @GetMapping("/access-denied")
    public String error() {
        return "error-403";
    }

    @GetMapping("/success")
    public String success() {
        return "views/success";
    }

    @GetMapping("/cart")
    public String Cart() {
        return "views/cart";
    }

    @GetMapping("/detail-medicine")
    public String detailMedicine() {
        return "views/detailMedicine";
    }


    @GetMapping("/check-out")
    public String Checkout() {
        return "views/checkout";
    }
}
