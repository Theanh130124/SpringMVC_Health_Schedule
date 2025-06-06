/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.service.HealthRecordService;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
 * @author Asus
 */
@RestController
@RequestMapping("/api")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @PreAuthorize("hasAuthority('Patient')")
    @PostMapping("/health-record")
    public ResponseEntity<?> addRecord(@RequestParam Map<String, String> params) {
        try {
            return new ResponseEntity<>(healthRecordService.addHealthRecord(params), HttpStatus.CREATED);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/health-record/{recordId}")
    public ResponseEntity<?> updateRecord(@PathVariable("recordId") int id, @RequestParam Map<String, String> params, Principal principal) {
        try {
            return new ResponseEntity<>(healthRecordService.updateHealthRecord(id, params, principal), HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/health-record")
    public ResponseEntity<?> getRecordByUser(Principal principal, @RequestParam Map<String, String> params) {
        try {
            return new ResponseEntity<>(healthRecordService.getHealthRecordByUserId(params, principal), HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @GetMapping("/health-record/appointment/{appointmentId}")
    public ResponseEntity<?> getRecordByAppointmentId(@PathVariable("appointmentId") int id, Principal principal) {
        try {
            return new ResponseEntity<>(healthRecordService.getHealthRecordByAppointmentId(id, principal), HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
