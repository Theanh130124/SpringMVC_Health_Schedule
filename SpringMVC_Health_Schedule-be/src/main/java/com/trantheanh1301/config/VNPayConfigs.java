/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.config;

/**
 *
 * @author Asus
 */
public class VNPayConfigs {
    public static String vnp_Version = "2.1.0";
    public static String vnp_Command = "pay";
    public static String vnp_TmnCode = "NVKZ39WO";
    public static String vnp_HashSecret = "BZ6PKZQX44RERXQ01ICF6N6BHDBEJJF9";
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_ReturnUrl = "http://localhost:8080/SpringMVC_Health_Schedule/api/payment/vnpay-return";//Sau này lên reactJS thì thay đổi link này thành link component hiển thị kết qua
}
