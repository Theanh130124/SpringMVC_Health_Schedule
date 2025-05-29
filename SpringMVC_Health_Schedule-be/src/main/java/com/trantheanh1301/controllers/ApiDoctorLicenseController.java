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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<?> createLicense(@RequestBody Map<String, String> params) {
        try {
            Doctorlicense license = licenseService.registerLicense(params);
            return new ResponseEntity<>(license, HttpStatus.CREATED);
        }catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }
        catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }

        //Permission ở đây ( Bác sĩ đó mới đc update -> dưới service
    }

    @PreAuthorize("hasAuthority('Admin')")
    @PatchMapping("/doctor_license/{id}")
    public ResponseEntity<?> updateLicense(@PathVariable int id, @RequestParam Map<String, String> params) {
        try {
            Doctorlicense updated = licenseService.updateLicense(id, params);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    
    
    
    @PreAuthorize("hasAuthority('Admin')")
    @DeleteMapping("/doctor_license/{id}")
    public ResponseEntity<?> removeLicense(@PathVariable int id) {
        try {
            licenseService.removeLicense(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);// không viết vào vì không muốn trả ra gì cả ngoài status khi xóa xong

        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
