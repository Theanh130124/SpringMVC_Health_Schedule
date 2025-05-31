/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Doctor;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface DoctorService {
    Doctor register(Doctor u);
    Doctor getDoctorById(int doctorId);
    List<Doctor> getDoctor(Map<String,String> params);
    public Doctor updateDoctorRating(int doctorId);
}
