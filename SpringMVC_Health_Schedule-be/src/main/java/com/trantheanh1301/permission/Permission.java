/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.permission;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.pojo.User;
import org.springframework.security.access.AccessDeniedException;

/**
 *
 * @author thean
 */
public class Permission {

    public static void OwnerAppointment(User currentUser, Appointment appointment) {
        if (!appointment.getPatientId().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên lịch hẹn này.");
        }
    }
    
    public static void OwnerAppointmentDoctor(User currentUser, Appointment appointment) {
        if (!appointment.getDoctorId().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên lịch hẹn này.");
        }
    }

    public static void Personal(User currentUser, User user) {
        if (!user.getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác cập nhật thông tin cá nhân.");
        }

    }

    //Dung de cap nhat
    public static void OwnerHealthRecord(User currentUser, Healthrecord healthRecord, Appointment appointment) {

        Integer currentUserId = currentUser.getUserId();
        boolean isPatientorDoctor = true;
        // Neu la benh nhan
        if (healthRecord != null) {
            isPatientorDoctor = healthRecord.getUserId() != null
                    && currentUserId.equals(healthRecord.getUserId().getUserId());
        }

        // Neu la bac si
        if (appointment != null) {
            Doctor doctor = appointment.getDoctorId() != null ? appointment.getDoctorId() : null;
            isPatientorDoctor = doctor != null
                    && doctor.getUser() != null
                    && currentUserId.equals(doctor.getUser().getUserId());
        }
        if (!isPatientorDoctor) {//Neu khong phai la 1 trong 2 thi forbidden
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên hồ sơ này.");
        }
    }

    public static void OwnerDoctorAppointment(User currentDoctor, Appointment appointment) {
        if (!currentDoctor.getDoctor().getDoctorId().equals(appointment.getDoctorId().getDoctorId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên lịch hẹn này.");
        }
    }
    
    public static void OwnerInvoice( User currentUser, Invoice invoice) {
        if (!currentUser.getUserId().equals(invoice.getAppointmentId().getPatientId().getPatientId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên hóa đơn này.");
        }
    }
    
    public static void OwnerPayment(User currentUser, Payment payment){
        if (!currentUser.getUserId().equals(payment.getInvoiceId().getAppointmentId().getPatientId().getPatientId())) {
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác này trên thanh toán này.");
        }
    }

}
