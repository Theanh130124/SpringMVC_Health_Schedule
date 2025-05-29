/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.permission.Permission;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.InvoiceRepository;
import com.trantheanh1301.repository.PaymentRepository;
import com.trantheanh1301.service.InvoiceService;
import com.trantheanh1301.service.PaymentService;
import com.trantheanh1301.service.UserService;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Asus
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private InvoiceService invoiceService;

    @Override
    public Payment addPayment(Map<String, String> params) {

        Payment payment = new Payment();
        payment.setInvoiceId(invoiceRepository.getInvoiceById(Integer.valueOf(params.get("invoiceId"))));
        payment.setAmountPaid(new BigDecimal(params.get("amount")));
        payment.setPaymentMethod(params.get("paymentMethod"));
        payment.setTransactionId(params.get("transactionId"));
        payment.setNotes(params.get("notes"));

        return this.paymentRepository.addPayment(payment);
    }

    @Override
    public Payment updatePayment(int id, Map<String, String> params) {
        Payment payment = this.getPaymentById(id);
        payment.setStatus(params.get("status"));
        payment.setTransactionId(params.get("transactionId"));
        return this.paymentRepository.updatePayment(payment);
    }

    @Override
    public Payment getPaymentById(int id) {
        return this.paymentRepository.getPaymentById(id);
    }

    @Override
    public Payment getPaymentByInvoiceId(int id, Principal principal) {
        User u = this.userService.getUserByUsername(principal.getName());
        Payment payment = this.paymentRepository.getPaymentByInvoiceId(id);
        
        Invoice invoice = invoiceService.getInvoiceById(payment.getInvoiceId().getInvoiceId());
        
        //Kiem tra xem hoa don do co phai bac si cung appointment hay khong
        if(u.getDoctor()!=null&&u.getDoctor().getDoctorId().equals(invoice.getAppointmentId().getDoctorId().getDoctorId())){
            return payment;
        }               
        Permission.OwnerPayment(u, payment);
        return payment;
    }

    @Override
    public Payment getPaymentByTransactionId(String id, Principal principal) {
        User u = this.userService.getUserByUsername(principal.getName());
        Payment payment = this.paymentRepository.getPaymentByTransactionId(id);
        Permission.OwnerPayment(u, payment);        
        return payment;
    }
}
