/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.utils;

/**
 *
 * @author Asus
 */
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
public class MomoUtils {
    public static String encode(String key, String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes("UTF-8"));
        return Base64.getEncoder().encodeToString(hash);
    }
}
