/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Payment;
import java.util.Map;

/**
 *
 * @author Asus
 */
public interface PaymentService {
    public Payment addPayment(Map<String,String> params);
    public Payment updatePayment(int id, Map<String,String>params);
    public Payment getPaymentById(int id);
    
}
