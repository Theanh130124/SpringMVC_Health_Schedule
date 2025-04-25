/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.config.VNPayConfigs;
import com.trantheanh1301.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/create-vnpay-url")
    @ResponseBody
    public String createVnpayPayment(@RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            HttpServletRequest request) throws UnsupportedEncodingException {

        String vnp_TxnRef = String.valueOf(System.currentTimeMillis());
        String vnp_Amount = String.valueOf(amount * 100);
        String vnp_IpAddr = request.getRemoteAddr();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNPayConfigs.vnp_Version);
        vnp_Params.put("vnp_Command", VNPayConfigs.vnp_Command);
        vnp_Params.put("vnp_TmnCode", VNPayConfigs.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", vnp_Amount);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPayConfigs.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String value = vnp_Params.get(fieldName);
            if ((value != null) && (value.length() > 0)) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(value, "UTF-8"));
                query.append(fieldName).append('=').append(URLEncoder.encode(value, "UTF-8"));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = VNPayUtils.hmacSHA512(VNPayConfigs.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        String paymentUrl = VNPayConfigs.vnp_PayUrl + "?" + query.toString();
        return paymentUrl;
    }

    @GetMapping("/vnpay-return")
    @ResponseBody
    public Map<String, Object> vnpayReturn(HttpServletRequest request) {
        Map<String, String[]> fields = request.getParameterMap();
        Map<String, String> vnpParams = new HashMap<>();
        for (Map.Entry<String, String[]> entry : fields.entrySet()) {
            vnpParams.put(entry.getKey(), entry.getValue()[0]);
        }

        // Lấy và loại bỏ vnp_SecureHash khỏi danh sách tham số
        String vnp_SecureHash = vnpParams.remove("vnp_SecureHash");

        // Log các tham số nhận được từ VNPay
        System.out.println("Received Parameters: " + vnpParams);

        // Sắp xếp các tham số còn lại theo thứ tự
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String value = vnpParams.get(fieldName);
            // Tạo chuỗi hashData cho các tham số
            hashData.append(fieldName).append('=').append(value);
            if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                hashData.append('&');
            }
        }

        // Tính toán chữ ký mới
        String calculatedHash = VNPayUtils.hmacSHA512(VNPayConfigs.vnp_HashSecret, hashData.toString());

        //Du lieu mac dinh neu nhu khong thanh toan thanh cong
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Chữ ký không hợp lệ!");

        // So sánh chữ ký tính toán được với chữ ký trả về từ VNPay
        if (calculatedHash.equals(vnp_SecureHash)) {
            String responseCode = vnpParams.get("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                response.put("status", "success");
                response.put("message", "Thanh toán thành công!");
            } else {
                response.put("status", "fail");
                response.put("message", "Thanh toán thất bại!");
            }

            response.put("transactionNo", vnpParams.get("vnp_TransactionNo"));
            response.put("txnRef", vnpParams.get("vnp_TxnRef"));
            response.put("amount", vnpParams.get("vnp_Amount"));
            response.put("orderInfo", vnpParams.get("vnp_OrderInfo"));
        }
        return response;
    }

}
