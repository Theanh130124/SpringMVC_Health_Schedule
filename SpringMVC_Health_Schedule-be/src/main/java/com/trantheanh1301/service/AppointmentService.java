/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Appointment;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface AppointmentService {

    Appointment registerAppointment(Map<String, String> params);

    List<Appointment> getListAppointment(Map<String, String> params);

    Appointment getAppointmentById(int id);

    Appointment updateAppointment(int id, Map<String, String> params,Principal principal);

    void deleteAppointment(Map<String, String> params, int id,Principal principal);
//Phần nhắc nhở lịch hẹn
    void sendAppoinmetReminders();
    
    Appointment updateStatusAppointment(int id, Map<String,String> params);

}
