/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Doctorlicense;
import com.trantheanh1301.service.DoctorLicenseService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author LAPTOP
 */
@RestController
@RequestMapping("/api")
public class ApiDoctorLicenseController {

    @Autowired
    private DoctorLicenseService licenseService;

    
    //Xem xóa sửa nửa , -> chỉ có current mới dc xem và , admin , (gửi rồi không đc sửa) -> nếu sửa thì phải cho admin duyệt nữa
    
    @PostMapping("/doctor_license")
    //@RequestParam  sẽ gửi application/x-www-form-urlencoded(form-data)
    //@RequestBody thì raw -> json
    public ResponseEntity<?> createLicense(@RequestParam Map<String, String> params) {
        try {
            Doctorlicense license = licenseService.register_license(params);
            return new ResponseEntity<>(license, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
