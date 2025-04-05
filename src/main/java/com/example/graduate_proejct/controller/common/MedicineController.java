package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.request.MedicineRequest;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

//    @GetMapping
//    public ResponseEntity<List<Medicine>> getAllMedicines() {
//        return ResponseEntity.ok(medicineService.getAllMedicines());
//    }

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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMedicines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size,
            @RequestParam(value = "categoryId", required = false) Integer categoryId) {

        Page<Medicine> medicinePage;
        Pageable pageable = PageRequest.of(page, size);

        if (categoryId != null) {
            medicinePage = medicineService.getMedicinesByCate(categoryId, pageable);
        } else {
            medicinePage = medicineService.getAllMedicines(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("medicines", medicinePage.getContent());
        response.put("currentPage", medicinePage.getNumber());
        response.put("totalItems", medicinePage.getTotalElements());
        response.put("totalPages", medicinePage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
