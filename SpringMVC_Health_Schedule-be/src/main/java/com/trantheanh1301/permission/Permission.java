/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.permission;

import com.trantheanh1301.pojo.Appointment;
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
    public static void Personal (User currentUser , User user){
        if (!user.getUserId().equals(currentUser.getUserId())){
            throw new AccessDeniedException("Bạn không có quyền thực hiện thao tác cập nhật thông tin cá nhân.");
        }
        
    }
}
