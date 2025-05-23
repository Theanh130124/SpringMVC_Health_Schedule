/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trantheanh1301.config.MomoConfigs;
import static com.trantheanh1301.config.MomoConfigs.SECRET_KEY;
import com.trantheanh1301.pojo.MomoRequest;
import com.trantheanh1301.service.MomoService;
import com.trantheanh1301.utils.MomoUtils;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import net.minidev.json.JSONObject;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

/**
 *
 * @author Asus
 */
@Service
public class MomoServiceImpl implements MomoService {

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
                .append("&requestType=captureWallet");

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
        requestBody.put("requestType", "captureWallet");
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
    
}
