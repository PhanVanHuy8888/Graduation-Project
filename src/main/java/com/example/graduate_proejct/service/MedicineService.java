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

    private CategoryMedicineRepository categoryMedicineRepository;

    private SupplierRepository supplierRepository;

    private static final String IMAGE_DIRECTORY = "src/main/resources/static/img/";

    public Medicine createMedicine(MedicineRequest medicineRequest, MultipartFile imageFile) throws IOException {
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

        Medicine medicine = new Medicine();
        BeanUtils.copyProperties(medicineRequest, medicine);
        medicine.setImage("/img/" + fileName);

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

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine updateMedicine(Integer id, Medicine medicineDetails) {
        Medicine medicine = getMedicineById(id);
        medicine.setName(medicineDetails.getName());
        medicine.setPrice(medicineDetails.getPrice());
        medicine.setDescription(medicineDetails.getDescription());
        medicine.setManufacturer(medicineDetails.getManufacturer());
        medicine.setIngredient(medicineDetails.getIngredient());
        medicine.setRegistrationNumber(medicineDetails.getRegistrationNumber());
        medicine.setQualityStandards(medicineDetails.getQualityStandards());
        medicine.setShelfLife(medicineDetails.getShelfLife());
        medicine.setDosageForm(medicineDetails.getDosageForm());
        medicine.setSpecification(medicineDetails.getSpecification());
        medicine.setOrigin(medicineDetails.getOrigin());
        medicine.setCategoryMedicine(medicineDetails.getCategoryMedicine());
        medicine.setSupplier(medicineDetails.getSupplier());
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Integer id) {
        medicineRepository.deleteById(id);
    }
}
