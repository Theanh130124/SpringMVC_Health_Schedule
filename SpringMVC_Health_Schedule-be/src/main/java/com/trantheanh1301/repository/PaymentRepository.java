/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Payment;

/**
 *
 * @author LAPTOP
 */
public interface PaymentRepository {    
    public Payment addPayment(Payment payment);
    public Payment updatePayment(Payment payment);
    public Payment getPaymentById(int id);
    public Payment getPaymentByInvoiceId(int id);
    public Payment getPaymentByTransactionId(String id);
}
