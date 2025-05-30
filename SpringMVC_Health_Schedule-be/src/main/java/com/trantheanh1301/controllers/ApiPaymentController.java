/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.service.PaymentService;
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
public class ApiPaymentController {

    @Autowired
    private PaymentService paymentService;

    @PreAuthorize("hasAuthority('Patient')")
    @PostMapping("/payments")
    public ResponseEntity<?> addPayment(@RequestParam Map<String, String> params) {
        try {
            return new ResponseEntity<>(paymentService.addPayment(params), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
    @PatchMapping("/payments/{paymentId}")
    public ResponseEntity<?> updatePayment(@RequestBody Map<String, String> params, @PathVariable("paymentId") int id) {
        try {
            return new ResponseEntity<>(paymentService.updatePayment(id, params), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }*/
    @PreAuthorize("hasAuthority('Patient')")
    @GetMapping("/payment/{invoiceId}")
    public ResponseEntity<?> getPaymentByInvoice(@PathVariable("invoiceId") int id, Principal principal) {
        try {
            return new ResponseEntity<>(paymentService.getPaymentByInvoiceId(id, principal), HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Kiểm tra xem có payment nào trùng transactionId không để tạo hóa đơn
    @PreAuthorize("hasAuthority('Patient')")
    @GetMapping("/payment-transaction/{transactionId}")
    public ResponseEntity<?> getPaymentByTransactionId(@PathVariable("transactionId") String id, Principal principal) {
        try {
            Payment p = paymentService.getPaymentByTransactionId(id, principal);
            if (p == null) {
                return new ResponseEntity<>(new ErrorResponseFormatter("Không tìm thấy thanh toán."), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(p, HttpStatus.OK);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
