/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.config.VNPayConfigs;
import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.service.EmailService;
import com.trantheanh1301.service.VNPayService;
import com.trantheanh1301.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Asus
 */
@Controller
@RequestMapping("/api/payment")
public class VNPayController {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private VNPayService vnpayService;
    
    @GetMapping("/create-vnpay-url")
    @ResponseBody
    public ResponseEntity<?> createVnpayPayment(@RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request, Principal principal) throws UnsupportedEncodingException {
         try {
             String url = vnpayService.createVnpayPayment(amount, orderInfo, request, principal);
             return new ResponseEntity<>(url,HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
    
    @PostMapping("/send-mail")
    public ResponseEntity<?> sendPaymentMail(@RequestParam Map<String,String> params) {
        try {          
            emailService.sendPaymentSuccessEmail(params.get("email"), params.get("patientName"), params.get("amount"), params.get("transactionId"));
            return ResponseEntity.ok(Map.of("message", "Đã gửi email thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Lỗi gửi mail: " + e.getMessage()));
        }
    }
}
