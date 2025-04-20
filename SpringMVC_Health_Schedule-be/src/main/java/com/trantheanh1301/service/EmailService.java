/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

/**
 *
 * @author LAPTOP
 */
public interface EmailService {
    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName, String time);
    
}
