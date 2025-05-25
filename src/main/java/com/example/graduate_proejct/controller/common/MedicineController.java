package com.example.graduate_proejct.controller.common;

import com.example.graduate_proejct.dto.request.MedicineRequest;
import com.example.graduate_proejct.entity.Medicine;
import com.example.graduate_proejct.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/getMede")
    public ResponseEntity<List<Medicine>> getMede() {
        return ResponseEntity.ok(medicineService.getMede());
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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMedicines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "sort", required = false) String sortDirection) {

        Page<Medicine> medicinePage;
        if (categoryId != null) {
            medicinePage = medicineService.getMedicinesByCate(categoryId, page, size, sortDirection);
        } else {
            medicinePage = medicineService.getAllMedicines(page, size, sortDirection);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("medicines", medicinePage.getContent());
        response.put("currentPage", medicinePage.getNumber());
        response.put("totalItems", medicinePage.getTotalElements());
        response.put("totalPages", medicinePage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMedicines(
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Medicine> pageResult = medicineService.searchMedicine(keyword, pageable);

        Map<String, Object> result = new HashMap<>();
        result.put("medicines", pageResult.getContent());
        result.put("totalPages", pageResult.getTotalPages());
        result.put("currentPage", page);
        return ResponseEntity.ok(result);
    }

}
