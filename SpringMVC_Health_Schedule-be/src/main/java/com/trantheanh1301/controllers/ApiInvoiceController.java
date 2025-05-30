/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.service.InvoiceService;
import java.security.Principal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.EntityResponse;

/**
 *
 * @author Asus
 */
@RestController
@RequestMapping("/api")
public class ApiInvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @PreAuthorize("hasAuthority('Patient')")
    @PostMapping("/invoice")
    public ResponseEntity<?> addInvoice(@RequestParam Map<String, String> params){
        try {            
            return new ResponseEntity<>(invoiceService.addInvoice(params), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }       
    }
    
    /*
    @PostMapping("/invoice/{invoiceId}")
    public ResponseEntity<?> addInvoice(@RequestBody Map<String, String> params, @PathVariable ("invoiceId") int id){
        try {            
            return new ResponseEntity<>(invoiceService.updatePaymentStatusInvoice(id, params), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }       
    }*/
    @PreAuthorize("hasAuthority('Patient')")
    @GetMapping("/invoice/{appointmentId}")
    public ResponseEntity<?> getInvoiceByAppointmentId(@PathVariable ("appointmentId") int id, Principal principal){
        try {            
            return new ResponseEntity<>(invoiceService.getInvoiceByAppointmentId(id,principal), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }       
    }
    
}
