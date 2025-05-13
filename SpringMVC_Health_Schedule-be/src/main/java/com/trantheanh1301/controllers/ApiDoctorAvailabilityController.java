/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Doctoravailability;
import com.trantheanh1301.service.DoctorAvailabilityService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
public class ApiDoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityService doctoravailabilityService;

    @PreAuthorize("hasAuthority('Doctor')")
    @GetMapping("/doctor_availability/{doctorId}")
    public ResponseEntity<?> getAvailability(@PathVariable(value = "doctorId") int doctorId) {
        try {

            return new ResponseEntity<>(doctoravailabilityService.getAvailability(doctorId), HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PreAuthorize("hasAuthority('Doctor')")
    @PostMapping("/doctor_availability")
    public ResponseEntity<?> createAvailability(@RequestBody Map<String, String> params
    ) {
        try {
            Doctoravailability dvt = doctoravailabilityService.registerDoctorAvailability(params);
            return new ResponseEntity<>(dvt, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }

        //Permission ở đây ( Bác sĩ đó mới đc update -> dưới service
    }

    @PreAuthorize("hasAuthority('Doctor')")
    @PatchMapping("/doctor_availability/{id}")
    public ResponseEntity<?> updateAvailability(@PathVariable int id, @RequestBody Map<String, String> params
    ) {
        try {
            Doctoravailability updated = doctoravailabilityService.updateDoctorAvailability(id, params);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

}
