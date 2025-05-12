/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Appointment;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface AppointmentRepository {
    public Appointment addOrUpdate(Appointment a);
    public Appointment getAppointmentById(int id);
    public List<Appointment> getListAppointment(Map<String,String> params);
    public void delete(Appointment a);

}
