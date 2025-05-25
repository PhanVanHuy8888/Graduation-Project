package com.example.graduate_proejct.service;

import com.example.graduate_proejct.dto.request.MedicineRequest;
import com.example.graduate_proejct.entity.CategoryMedicine;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.entity.Supplier;
import com.example.graduate_proejct.repository.CategoryMedicineRepository;
import com.example.graduate_proejct.repository.MedicineRepository;
import com.example.graduate_proejct.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository medicineRepository;

    private final CategoryMedicineRepository categoryMedicineRepository;

    private final SupplierRepository supplierRepository;

    private static final String IMAGE_DIRECTORY = "src/main/resources/static/img/";

    public Medicine createMedicine(MedicineRequest medicineRequest, MultipartFile imageFile) throws IOException {
        Medicine medicine = new Medicine();
        BeanUtils.copyProperties(medicineRequest, medicine);

        // Kiểm tra nếu ảnh được gửi lên
        if (imageFile != null && !imageFile.isEmpty()) {
            // Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
            File directory = new File(IMAGE_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu ảnh vào thư mục static/img/
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String imagePath = IMAGE_DIRECTORY + fileName;
            Path path = Paths.get(imagePath);
            Files.write(path, imageFile.getBytes());

            medicine.setImage("/img/" + fileName);
        } else {
            medicine.setImage(null); // Nếu không có ảnh, đặt giá trị `null` hoặc một ảnh mặc định
        }

        // Xử lý các thông tin khác
        CategoryMedicine category = categoryMedicineRepository.findById(medicineRequest.getCategoryMedicineId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Supplier supplier = supplierRepository.findById(medicineRequest.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        medicine.setCategoryMedicine(category);
        medicine.setSupplier(supplier);

        return medicineRepository.save(medicine);
    }


    public Medicine getMedicineById(Integer id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    public Page<Medicine> getAllMedicines(int page, int size, String sortDirection) {
        Sort sort = Sort.unsorted();

        if ("asc".equalsIgnoreCase(sortDirection)) {
            sort = Sort.by("price").ascending();
        } else if ("desc".equalsIgnoreCase(sortDirection)) {
            sort = Sort.by("price").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        return medicineRepository.findAll(pageable);
    }


    public List<Medicine> getMede() {
        return medicineRepository.findAll();
    }

    public Medicine updateMedicine(Integer id, MedicineRequest medicineRequest, MultipartFile imageFile) throws IOException {
        Medicine medicine = getMedicineById(id);

        // Cập nhật thông tin từ request
        BeanUtils.copyProperties(medicineRequest, medicine, "image");

        // Kiểm tra nếu có ảnh mới
        if (imageFile != null && !imageFile.isEmpty()) {
            // Lưu ảnh vào thư mục static/img/
            File directory = new File(IMAGE_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String imagePath = IMAGE_DIRECTORY + fileName;
            Path path = Paths.get(imagePath);
            Files.write(path, imageFile.getBytes());

            // Cập nhật đường dẫn ảnh mới
            medicine.setImage("/img/" + fileName);
        }

        // Cập nhật thông tin danh mục và nhà cung cấp
        CategoryMedicine category = categoryMedicineRepository.findById(medicineRequest.getCategoryMedicineId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Supplier supplier = supplierRepository.findById(medicineRequest.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        medicine.setCategoryMedicine(category);
        medicine.setSupplier(supplier);

        return medicineRepository.save(medicine);
    }

//    public Page<Medicine> getMedicinesByCate(Integer categoryId, Pageable pageable) {
//        return medicineRepository.findByCategoryMedicineId(categoryId, pageable);
//    }

    public Page<Medicine> getMedicinesByCate(Integer categoryId, int page, int size, String sortDirection) {
        Sort sort = Sort.unsorted();
        if ("asc".equalsIgnoreCase(sortDirection)) {
            sort = Sort.by("price").ascending();
        } else if ("desc".equalsIgnoreCase(sortDirection)) {
            sort = Sort.by("price").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        return medicineRepository.findByCategoryMedicineId(categoryId, pageable);
    }

    public Page<Medicine> searchMedicine(String keyword, Pageable pageable) {
        return medicineRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }


    public void deleteMedicine(Integer id) {
        medicineRepository.deleteById(id);
    }

    public long countAllProducts() {
        return medicineRepository.count();
    }
}
