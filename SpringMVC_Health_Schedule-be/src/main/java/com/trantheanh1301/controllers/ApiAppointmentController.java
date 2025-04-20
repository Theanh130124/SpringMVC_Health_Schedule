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
public class ApiAppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @PostMapping("/book_doctor")
    public ResponseEntity<?> getListDoctor(@RequestParam Map<String, String> params){
        try{
           
            return new ResponseEntity<>(appointmentService.registerAppointment(params), HttpStatus.CREATED);
        }catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}
