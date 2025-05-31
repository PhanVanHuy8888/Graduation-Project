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
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
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
    public String Cart(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/cart";
    }

    @GetMapping("/medicine")
    public String Medicine(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/medicine";
    }

    @GetMapping("/contact")
    public String Contact(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/contact";
    }

    @GetMapping("/article")
    public String Article(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/article";
    }

    @GetMapping("/detail-article")
    public String editArticle(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/articleDetail";
    }

    @GetMapping("/detail-medicine")
    public String detailMedicine(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/detailMedicine";
    }

    @GetMapping("/search-medicine")
    public String searchMedicine(Model model) {
        model.addAttribute("isAuthenticated", false); // Giá trị mặc định

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();

            // Kiểm tra người dùng có trong database không
            User user = userRepository.findByEmail(username)
                    .orElse(null);

            if (user != null) {
                model.addAttribute("username", username);
                model.addAttribute("usernames", user.getUserName());
                model.addAttribute("userId", user.getId());
                model.addAttribute("isAuthenticated", true); // Cập nhật lại giá trị
                System.out.println(user.getId());
            }
        }
        return "views/search-result";
    }

    @GetMapping("/check-out")
    public String Checkout() {
        return "views/checkout";
    }

    @GetMapping("/payment")
    public String Payment() {
        return "views/payment";
    }


    @GetMapping("/payment-confirm")
    public String paymentSuccess() {
        return "views/payment-success";
    }


}
