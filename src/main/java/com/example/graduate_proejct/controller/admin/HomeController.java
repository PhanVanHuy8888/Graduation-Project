package com.example.graduate_proejct.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/home")
    public String home() {
        return "admin/home";
    }

    //    Category Medicine
    @GetMapping("/list-cate-medicine")
    public String ListCateMedicine() {
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
    public String ListCate() {
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
    public String ListSupplier() {
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
    public String ListMedicine() {
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

}
