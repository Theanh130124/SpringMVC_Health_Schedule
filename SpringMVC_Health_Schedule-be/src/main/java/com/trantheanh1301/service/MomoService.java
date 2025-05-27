/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.dto.MomoIPNRequestDTO;
import java.util.Map;
import org.springframework.http.ResponseEntity;

/**
 *
 * @author Asus
 */
public interface MomoService {
    public String createPaymentRequest(long amount, String orderId) throws Exception;
    public ResponseEntity<?> handleMoMoIPN(MomoIPNRequestDTO ipn);
}
