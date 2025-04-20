/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.service.AvailabeslotService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author LAPTOP
 */
@RestController
@RequestMapping("/api")
public class ApiAvailableslotControllers {

    @Autowired
    private AvailabeslotService availabeSlotService;
    
    @GetMapping("/find_slot")
    public ResponseEntity<?> getAvailabeSlot(@RequestParam Map<String, String> params) {
        try {
            List<Availableslot> listDoctor = availabeSlotService.findSlot(params);
            return new ResponseEntity<>(listDoctor, HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi" + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
