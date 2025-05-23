/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trantheanh1301.config.MomoConfigs;
import com.trantheanh1301.service.MomoService;
import com.trantheanh1301.utils.MomoUtils;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author Asus
 */
@Controller
@RequestMapping("/api/payment")
public class MomoController {

    @Autowired
    private MomoService momoService;
    
    @PostMapping("/create-momo-url")
    public ResponseEntity<?> createMomoPayment(@RequestParam long amount, 
                                             @RequestParam String orderId) {
        try {
            String paymentUrl = momoService.createPaymentRequest(amount, orderId);
            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Lỗi tạo thanh toán: " + e.getMessage());
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<?> momoIPN(@RequestBody Map<String, Object> body) {
        System.out.println("MoMo IPN: " + body);
        return ResponseEntity.ok("Received");
    }
}
