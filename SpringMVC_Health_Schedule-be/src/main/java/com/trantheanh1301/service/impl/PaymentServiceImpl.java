/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.repository.InvoiceRepository;
import com.trantheanh1301.repository.PaymentRepository;
import com.trantheanh1301.service.PaymentService;
import java.math.BigDecimal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Override
    public Payment addPayment(Map<String, String> params) {

        Payment payment = new Payment();

        payment.setInvoiceId(invoiceRepository.getInvoiceById(Integer.valueOf(params.get("invoiceId"))));
        payment.setAmountPaid(new BigDecimal(params.get("amountPaid")));
        payment.setPaymentMethod(params.get("paymentMethod"));
        payment.setTransactionId(params.get("transactionId"));
        payment.setNotes(params.get("notes"));
       
        return this.paymentRepository.addPayment(payment);
    }
}
