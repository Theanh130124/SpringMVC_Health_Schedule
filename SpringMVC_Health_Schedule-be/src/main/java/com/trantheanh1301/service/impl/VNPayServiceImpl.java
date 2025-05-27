/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.config.VNPayConfigs;
import com.trantheanh1301.permission.Permission;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.EmailService;
import com.trantheanh1301.service.InvoiceService;
import com.trantheanh1301.service.PaymentService;
import com.trantheanh1301.service.UserService;
import com.trantheanh1301.service.VNPayService;
import com.trantheanh1301.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

/**
 *
 * @author Asus
 */
@Service
public class VNPayServiceImpl implements VNPayService {

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private InvoiceService invoiceService;
    
    @Autowired
    private PaymentService paymentService;

    @Override
    public String createVnpayPayment(int amount, String orderInfo, HttpServletRequest request, Principal principal) throws UnsupportedEncodingException {

        String[] ids = orderInfo.split("-");
        String invoiceId = ids[0];
        String paymentId = ids[1];
        
        User u = userService.getUserByUsername(principal.getName());
        Invoice invoice = invoiceService.getInvoiceById(Integer.valueOf(invoiceId));
       
        Payment payment = paymentService.getPaymentById(Integer.valueOf(paymentId));
        Payment paymentInvoice = paymentService.getPaymentByInvoiceId(Integer.valueOf(invoiceId));//Lay hoa don moi nhat
        
        if(!payment.getPaymentId().equals(paymentInvoice.getPaymentId())){
            throw new AccessDeniedException("Thanh toán không hợp lệ");
        }
        
        if(invoice.getAmount().compareTo(BigDecimal.valueOf(amount))!=0){
            throw new AccessDeniedException("Số tiền không hợp lệ");
        }
        
        if(paymentInvoice.getStatus().equals("Completed")){
            throw new AccessDeniedException("Hóa đơn đã hoàn thành");
        }
        
        Permission.OwnerInvoice(u, invoice);

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
}
