package com.example.graduate_proejct.controller.admin;

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
public class HomeController {

    private final UserRepository userRepository;

    @GetMapping("/home")
    public String home(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/home";
    }

    //    Category Medicine
    @GetMapping("/list-cate-medicine")
    public String ListCateMedicine(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/CategoryMedicine/categoryMedicineList";
    }

    @GetMapping("/add-cate-medicine")
    public String AddCateMedicine() {
        return "admin/CategoryMedicine/categoryMedicineAdd";
    }

    @GetMapping("/edit-cate-medicine")
    public String EditCateMedicine() {
        return "admin/CategoryMedicine/categoryMedicineEdit";
    }

    //    Category
    @GetMapping("/list-cate")
    public String ListCate(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Category/categoryList";
    }

    @GetMapping("/add-cate")
    public String AddCate() {
        return "admin/Category/categoryAdd";
    }

    @GetMapping("/edit-cate")
    public String EditCate() {
        return "admin/Category/categoryEdit";
    }

    //    Supplier
    @GetMapping("/list-supplier")
    public String ListSupplier(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Supplier/supplierList";
    }

    @GetMapping("/add-supplier")
    public String AddSupplier() {
        return "admin/Supplier/supplierAdd";
    }

    @GetMapping("/edit-supplier")
    public String EditSupplier() {
        return "admin/Supplier/supplierEdit";
    }

    //    Medicine
    @GetMapping("/list-medicine")
    public String ListMedicine(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Medicine/medicineList";
    }

    @GetMapping("/add-medicine")
    public String AddMedicine() {
        return "admin/Medicine/medicineAdd";
    }

    @GetMapping("/edit-medicine")
    public String EditMedicine() {
        return "admin/Medicine/medicineEdit";
    }

    //    User
    @GetMapping("/list-user")
    public String ListUser(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/User/userList";
    }

    //    Order
    @GetMapping("/list-order")
    public String ListOrder(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Order/orderList";
    }

    //    Contact
    @GetMapping("/list-contact")
    public String ListContact(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Contact/contactList";
    }

    //    Article
    @GetMapping("/list-article")
    public String ListArticle(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Article/articleList";
    }

    @GetMapping("/list-role")
    public String ListRole(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication.getPrincipal() instanceof String)) {
            String username = authentication.getName();
            User user = userRepository.findByEmail(username)
                    .orElse(null);
            model.addAttribute("usernames", user.getUserName());
            model.addAttribute("username", username);
            model.addAttribute("isAuthenticated", true);
        } else {
            model.addAttribute("isAuthenticated", false);
        }
        return "admin/Role/roleList";
    }

    @GetMapping("/user-form")
    public String userForm() {
        return "admin/User/user-form";
    }

    @GetMapping("/user-edit")
    public String userEdit() {
        return "admin/User/user-edit";
    }
}
