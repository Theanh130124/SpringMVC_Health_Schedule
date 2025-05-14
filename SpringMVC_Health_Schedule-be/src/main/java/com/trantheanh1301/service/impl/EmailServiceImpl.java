/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.service.EmailService;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

////Tạo một giao diện đặt lịch đẹp hơn.
//
//Gửi thêm cả lịch hẹn vào Google Calendar nếu cần.
//
//Thêm template HTML vào nội dung email.

@org.springframework.stereotype.Service
public class EmailServiceImpl implements EmailService {

    private final String username = "theanhtran13012004@gmail.com";
    private final String password = "mxia nuqr klzf owdk"; // App password nếu dùng Gmail

    public void sendAppointmentConfirmation(String toEmail, String subject, String patientName, String doctorName, String time) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username, "Phòng khám trực tuyến"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);

            String emailContent = String.format("""
                Xin chào %s,

                Bạn đã đặt lịch khám với bác sĩ %s vào lúc %s.
                Vui lòng đến đúng giờ.

                Trân trọng,
                Hệ thống quản lý khám bệnh
            """, patientName, doctorName, time);

            message.setText(emailContent);

            Transport.send(message);
            System.out.println("📧 Email xác nhận đã được gửi đến: " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendPaymentSuccessEmail(String toEmail, String patientName, String amount, String transactionId) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username, "Phòng khám trực tuyến"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject("Xác nhận thanh toán thành công");

            String content = String.format("""
                Xin chào %s,

                Chúng tôi xác nhận bạn đã thanh toán thành công với các thông tin sau:

                ✅ Mã giao dịch: %s
                💰 Số tiền: %s VNĐ

                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!

                Trân trọng,
                Hệ thống quản lý khám bệnh
            """, patientName, transactionId, amount);

            message.setText(content);
            Transport.send(message);

            System.out.println("✅ Đã gửi email thanh toán thành công đến " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
