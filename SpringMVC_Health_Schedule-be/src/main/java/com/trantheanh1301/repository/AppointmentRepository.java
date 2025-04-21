/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Appointment;

/**
 *
 * @author LAPTOP
 */
public interface AppointmentRepository {
    public Appointment addOrUpdat(Appointment a);
    public Appointment getAppointmentById(int id);
}
