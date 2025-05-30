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
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
        Payment paymentInvoice = paymentService.getPaymentByInvoiceId(Integer.valueOf(invoiceId),principal);//Lay hoa don moi nhat

        if (!payment.getPaymentId().equals(paymentInvoice.getPaymentId())) {
            throw new AccessDeniedException("Thanh toán không hợp lệ");
        }

        if (invoice.getAmount().compareTo(BigDecimal.valueOf(amount)) != 0) {
            throw new AccessDeniedException("Số tiền không hợp lệ");
        }

        if (paymentInvoice.getStatus().equals("Completed")) {
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
   
    @Override
    public Map<String, String> processReturnUrl(Map<String, String> params) {
        String receivedSecureHash = params.get("vnp_SecureHash");

        // Tạo bản sao để đảm bảo không làm thay đổi params gốc
        Map<String, String> filteredParams = new HashMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        // Sắp xếp các key theo thứ tự tăng dần
        SortedMap<String, String> sortedParams = new TreeMap<>(filteredParams);

        // Tạo chuỗi dữ liệu để hash theo định dạng key1=value1&key2=value2...
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            hashData.append(entry.getKey()).append('=').append(entry.getValue()).append('&');
        }
        hashData.deleteCharAt(hashData.length() - 1); // Xoá dấu & cuối

        // Tính toán chữ ký
        String myHash = VNPayUtils.hmacSHA512(VNPayConfigs.vnp_HashSecret, hashData.toString());
        System.out.println("Generated hash: " + myHash);
        System.out.println("Received hash: " + receivedSecureHash);
        System.out.println("Raw data: " + hashData.toString());

        if (!myHash.equals(receivedSecureHash)) {
            return null; // Chữ ký sai → request có thể giả mạo
        }

        // Nếu chữ ký đúng, xử lý cập nhật dữ liệu
        String[] ids = params.get("vnp_OrderInfo").split("-");
        String invoiceId = ids[0];
        String paymentId = ids[1];
        String transactionStatus = params.get("vnp_TransactionStatus");
        String responseCode = params.get("vnp_ResponseCode");

        if ("00".equals(transactionStatus) && "00".equals(responseCode)) {
            invoiceService.updatePaymentStatusInvoice(Integer.parseInt(invoiceId), Map.of("status", "Paid"));
            paymentService.updatePayment(Integer.parseInt(paymentId), Map.of(
                    "status", "Completed",
                    "transactionId", params.get("vnp_TransactionNo")
            ));
            
            Invoice invoice = invoiceService.getInvoiceById(Integer.parseInt(invoiceId));
            String email = invoice.getAppointmentId().getPatientId().getUser().getEmail();//Lay email
            String patientName = invoice.getAppointmentId().getPatientId().getUser().getFirstName()+" "+invoice.getAppointmentId().getPatientId().getUser().getLastName();
            String amount = params.get("vnp_Amount");
            String transactionId = params.get("vnp_TransactionNo");
            String amountFormatted = String.format("%,.2f", Double.parseDouble(amount) / 100);           
            emailService.sendPaymentSuccessEmail(email, patientName, amountFormatted, transactionId);     //Gui mail              
        } else {
            invoiceService.updatePaymentStatusInvoice(Integer.parseInt(invoiceId), Map.of("status", "Cancelled"));
            paymentService.updatePayment(Integer.parseInt(paymentId), Map.of(
                    "status", "Failed",
                    "transactionId", params.get("vnp_TransactionNo")
            ));
        }

        return params;
    }
}
