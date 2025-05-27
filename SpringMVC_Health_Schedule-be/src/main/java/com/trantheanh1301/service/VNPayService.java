/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.security.Principal;

/**
 *
 * @author Asus
 */
public interface VNPayService {
    public String createVnpayPayment(int amount,String orderInfo,HttpServletRequest request, Principal principal) throws UnsupportedEncodingException;
}
