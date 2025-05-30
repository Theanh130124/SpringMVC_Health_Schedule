/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trantheanh1301.config.MomoConfigs;
import static com.trantheanh1301.config.MomoConfigs.SECRET_KEY;
import com.trantheanh1301.dto.MomoIPNRequestDTO;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.MomoRequest;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.service.EmailService;
import com.trantheanh1301.service.InvoiceService;
import com.trantheanh1301.service.MomoService;
import com.trantheanh1301.service.PaymentService;
import com.trantheanh1301.utils.MomoUtils;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import net.minidev.json.JSONObject;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.trantheanh1301.utils.MomoUtils;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

/**
 *
 * @author Asus
 */
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class MomoServiceImpl implements MomoService {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private EmailService emailService;

    @Override
    public String createPaymentRequest(long amount, String orderId) throws Exception {
        String requestId = String.valueOf(System.currentTimeMillis());
        String orderInfo = "Thanh toan kham benh";
        String ipnUrl = MomoConfigs.IPN_URL;
        String redirectUrl = MomoConfigs.REDIRECT_URL;

        StringBuilder rawSignature = new StringBuilder()
                .append("accessKey=").append(MomoConfigs.ACCESS_KEY)
                .append("&amount=").append(amount)
                .append("&extraData=")
                .append("&ipnUrl=").append(ipnUrl)
                .append("&orderId=").append(orderId)
                .append("&orderInfo=").append(orderInfo)
                .append("&partnerCode=").append(MomoConfigs.PARTNER_CODE)
                .append("&redirectUrl=").append(redirectUrl)
                .append("&requestId=").append(requestId)
                .append("&requestType=payWithATM");

        System.out.println("Raw Signature: " + rawSignature.toString());

        String signature = MomoUtils.createSignature(rawSignature.toString(), MomoConfigs.SECRET_KEY);

        // Tạo JSON request
        JSONObject requestBody = new JSONObject();
        requestBody.put("partnerCode", MomoConfigs.PARTNER_CODE);
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", orderId);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", MomoConfigs.REDIRECT_URL);
        requestBody.put("ipnUrl", MomoConfigs.IPN_URL);
        requestBody.put("requestType", "payWithATM");
        requestBody.put("extraData", "");
        requestBody.put("signature", signature);
        requestBody.put("lang", "vi");

        System.out.println("Request Body: " + requestBody.toString());

        // Gửi request
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest paymentRequest = HttpRequest.newBuilder()
                .uri(URI.create(MomoConfigs.MOMO_ENDPOINT))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        HttpResponse<String> response = client.send(paymentRequest,
                HttpResponse.BodyHandlers.ofString());

        return response.body();
    }

    @Override
    public ResponseEntity<?> handleMoMoIPN(MomoIPNRequestDTO ipn) {
        try {

            System.out.println("Received IPN: " + new ObjectMapper().writeValueAsString(ipn));
            String rawHash = buildRawHashFromIPN(ipn);

            String calculatedSig = MomoUtils.createSignature1(rawHash, MomoConfigs.SECRET_KEY);

            System.out.println("rawHash: " + rawHash);
            System.out.println("MySig: " + calculatedSig);
            System.out.println("MomoSig: " + ipn.signature);
            System.out.println("Secretkey: " + MomoConfigs.SECRET_KEY);

            if (!calculatedSig.equals(ipn.signature)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "resultCode", 97,
                        "message", "Invalid signature"
                ));
            }

            // Parse orderId
            String[] ids = ipn.orderId.split("-");
            String invoiceId = ids[0];
            String paymentId = ids[1];

            // Cập nhật trạng thái
            if ("0".equals(ipn.resultCode)) {
                //updateInvoiceStatus(invoiceId, "Paid");
                updatePaymentStatus(paymentId, "Completed", ipn.transId);
                updateInvoiceStatus(invoiceId, "Paid");
                
                Invoice invoice = invoiceService.getInvoiceById(Integer.parseInt(invoiceId));
                String email = invoice.getAppointmentId().getPatientId().getUser().getEmail();//Lay email
                String patientName = invoice.getAppointmentId().getPatientId().getUser().getFirstName() + " " + invoice.getAppointmentId().getPatientId().getUser().getLastName();
                String amount = ipn.amount;
                String transactionId = ipn.transId;
                String amountFormatted = String.format("%,.2f", Double.parseDouble(amount) / 100);
                emailService.sendPaymentSuccessEmail(email, patientName, amountFormatted, transactionId);     //Gui mail
                return ResponseEntity.ok(Map.of(
                        "resultCode", 0,
                        "message", "Success"
                    ));                            
            } else {
                updateInvoiceStatus(invoiceId, "Cancelled");
                updatePaymentStatus(paymentId, "Failed", ipn.transId);
                return ResponseEntity.ok(Map.of(
                        "resultCode", 0,
                        "message", "Payment failed"
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                    "resultCode", 99,
                    "message", "Internal error"
            ));
        }
    }

    private String buildRawHashFromIPN(MomoIPNRequestDTO ipn) {
        Map<String, String> rawData = new LinkedHashMap<>();
        rawData.put("accessKey", MomoConfigs.ACCESS_KEY); // BẮT BUỘC PHẢI CÓ DÒNG NÀY
        rawData.put("amount", safe(ipn.amount));
        rawData.put("extraData", safe(ipn.extraData));
        rawData.put("message", safe(ipn.message));
        rawData.put("orderId", safe(ipn.orderId));
        rawData.put("orderInfo", safe(ipn.orderInfo));
        rawData.put("orderType", safe(ipn.orderType));
        rawData.put("partnerCode", safe(ipn.partnerCode));
        rawData.put("payType", safe(ipn.payType));
        rawData.put("requestId", safe(ipn.requestId));
        rawData.put("responseTime", safe(ipn.responseTime));
        rawData.put("resultCode", safe(ipn.resultCode));
        rawData.put("transId", safe(ipn.transId));

        // Nối các cặp key=value bằng dấu &
        return rawData.entrySet()
                .stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
    }

    private String safe(String input) {
        return input == null ? "" : input.trim();
    }

    private void updateInvoiceStatus(String invoiceId, String status) {
        Map<String, String> params = new HashMap<>();
        params.put("status", status);
        this.invoiceService.updatePaymentStatusInvoice(Integer.valueOf(invoiceId), params);
    }

    private void updatePaymentStatus(String paymentId, String status, String momoTransId) {
        Map<String, String> params = new HashMap<>();
        params.put("transactionId", momoTransId);
        params.put("status", status);
        Payment payment = paymentService.updatePayment(Integer.parseInt(paymentId), params);
    }

}
