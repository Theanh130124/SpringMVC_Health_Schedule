/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trantheanh1301.config.MomoConfigs;
import com.trantheanh1301.utils.MomoUtils;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author Asus
 */
@Controller
@RequestMapping("/api/payment")
public class MomoController {

    @PostMapping("/create-momo-url")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> params) {
        try {
            /*String orderId = String.valueOf(params.get("orderId"));
            String requestId = String.valueOf(params.get("requestId"));
*/
            String orderId = UUID.randomUUID().toString();
            String requestId = UUID.randomUUID().toString();
            String amount = String.valueOf(params.get("amount"));
            
            String orderInfo = "Payment for order " + orderId;

            String rawData = "accessKey=" + MomoConfigs.ACCESS_KEY
                    + "&amount=" + amount
                    + "&extraData="
                    + "&ipnUrl=" + MomoConfigs.IPN_URL
                    + "&orderId=" + orderId
                    + "&orderInfo=" + orderInfo
                    + "&partnerCode=" + MomoConfigs.PARTNER_CODE
                    + "&redirectUrl=" + MomoConfigs.REDIRECT_URL
                    + "&requestId=" + requestId
                    + "&requestType=captureWallet";

            String signature = MomoUtils.encode(MomoConfigs.SECRET_KEY, rawData);

            Map<String, Object> body = new HashMap<>();
            body.put("partnerCode", MomoConfigs.PARTNER_CODE);
            body.put("accessKey", MomoConfigs.ACCESS_KEY);
            body.put("requestId", requestId);
            body.put("amount", amount);
            body.put("orderId", orderId);
            body.put("orderInfo", orderInfo);
            body.put("redirectUrl", MomoConfigs.REDIRECT_URL);
            body.put("ipnUrl", MomoConfigs.IPN_URL);
            body.put("extraData", "");
            body.put("requestType", "captureWallet");
            body.put("lang", "vi");
            body.put("signature", signature);

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonBody = objectMapper.writeValueAsString(body);
            System.out.println("Json:\n" + jsonBody );
            System.out.println("rawData:\n" + rawData );
            System.out.println("Signature:\n" + signature );
            // Send request to MoMo
            URL url = new URL(MomoConfigs.MOMO_ENDPOINT);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            OutputStream os = conn.getOutputStream();
            os.write(jsonBody.getBytes());
            os.flush();
            os.close();

            Scanner scanner = new Scanner(conn.getInputStream());
            StringBuilder response = new StringBuilder();
            while (scanner.hasNext()) {
                response.append(scanner.nextLine());
            }

            return ResponseEntity.ok(objectMapper.readValue(response.toString(), Map.class));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi gọi MoMo: " + e.getMessage());
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<?> momoIPN(@RequestBody Map<String, Object> body) {
        System.out.println("MoMo IPN: " + body);
        return ResponseEntity.ok("Received");
    }
}
