package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.request.MedicineRequest;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Medicine> createMedicine(
            @RequestPart("medicine") MedicineRequest medicineRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Medicine savedMedicine = medicineService.createMedicine(medicineRequest, imageFile);
        return ResponseEntity.ok(savedMedicine);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Integer id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Integer id,
            @RequestPart("medicine") MedicineRequest medicineRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Medicine updatedMedicine = medicineService.updateMedicine(id, medicineRequest, imageFile);
        return ResponseEntity.ok(updatedMedicine);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Integer id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine deleted successfully");
    }
}
