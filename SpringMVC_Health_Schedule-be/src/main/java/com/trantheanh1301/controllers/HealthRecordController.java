/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.service.HealthRecordService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    
    @PostMapping("/health-record")
    public ResponseEntity<?> addRecord(@RequestParam Map<String, String> params) {
        try {
             return new ResponseEntity<>(healthRecordService.addHealthRecord(params), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PatchMapping("/health-record")
    public ResponseEntity<?> updateRecord(@RequestParam Map<String, String> params) {
        try {
             return new ResponseEntity<>(healthRecordService.updateHealthRecord(params), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
