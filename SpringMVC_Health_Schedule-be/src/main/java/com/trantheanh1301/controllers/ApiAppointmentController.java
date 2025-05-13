/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.service.AppointmentService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
public class ApiAppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PreAuthorize("hasAuthority('Patient')")
    @PostMapping("/book_doctor")
    public ResponseEntity<?> bookDoctor(@RequestParam Map<String, String> params) {
        try {

            return new ResponseEntity<>(appointmentService.registerAppointment(params), HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();

            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    //Nen permission dung nguoi thi moi xem duoc cua nguoi do theo token 
    @PreAuthorize("hasAnyAuthority('Patient', 'Doctor')")
    @GetMapping("/appointment")
    public ResponseEntity<?> getListAppointment(@RequestParam Map<String, String> params) {
        try {

            return new ResponseEntity<>(appointmentService.getListAppointment(params), HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAuthority('Patient')")
    @PatchMapping("/book_doctor/{id}")
    public ResponseEntity<?> updateBookDoctor(@RequestBody Map<String, String> params, @PathVariable(value = "id") int id) {
        try {

            return new ResponseEntity<>(appointmentService.updateAppointment(id, params), HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAuthority('Patient')")
    @DeleteMapping("/delete_booking/{id}")
    public ResponseEntity<?> deleteBookDoctor(@RequestBody Map<String, String> params, @PathVariable(value = "id") int id) {
        try {
            appointmentService.deleteAppointment(params, id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
