/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trantheanh1301.config.MomoConfigs;
import static com.trantheanh1301.config.MomoConfigs.SECRET_KEY;
import com.trantheanh1301.dto.MomoIPNRequestDTO;
import com.trantheanh1301.pojo.MomoRequest;
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

/**
 *
 * @author Asus
 */
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class MomoServiceImpl implements MomoService {

    @Value("${momo.secretKey}")
    private String momoSecret;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private InvoiceService invoiceService;

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

    @Transactional
    @Override
    public ResponseEntity<?> handleMoMoIPN(MomoIPNRequestDTO ipn) {
        try {

            System.out.println("Received IPN: " + new ObjectMapper().writeValueAsString(ipn));

            String rawHash = "accessKey=" + MomoConfigs.ACCESS_KEY
                    + "&amount=" + ipn.amount
                    + "&extraData=" + ipn.extraData
                    + "&orderId=" + ipn.orderId
                    + "&orderInfo=" + ipn.orderInfo
                    + "&orderType=" + ipn.orderType
                    + "&partnerCode=" + ipn.partnerCode
                    + "&payType=" + ipn.payType
                    + "&requestId=" + ipn.requestId
                    + "&responseTime=" + ipn.responseTime
                    + "&resultCode=" + ipn.resultCode
                    + "&transId=" + ipn.transId
                    + "&message=" + ipn.message.trim();

            String calculatedSig = MomoUtils.createSignature(rawHash, MomoConfigs.SECRET_KEY);

            System.out.println("rawHash: " + rawHash);
            System.out.println("MySig: " + calculatedSig);
            System.out.println("MomoSig: " + ipn.signature);

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
                updateInvoiceStatus(invoiceId, "Paid");
                updatePaymentStatus(paymentId, "Completed", ipn.transId);
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

    private void updateInvoiceStatus(String invoiceId, String status) {
        Map<String, String> params = new HashMap<>();
        params.put("status", status);
        this.invoiceService.updatePaymentStatusInvoice(Integer.valueOf(invoiceId), params);
    }

    private void updatePaymentStatus(String paymentId, String status, String momoTransId) {
        Map<String, String> params = new HashMap<>();
        params.put("transactionId", momoTransId);
        params.put("status", status);
        this.paymentService.updatePayment(Integer.valueOf(paymentId), params);
    }

}
