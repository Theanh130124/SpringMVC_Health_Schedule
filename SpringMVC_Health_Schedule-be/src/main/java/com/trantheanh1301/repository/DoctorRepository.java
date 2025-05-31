/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Doctor;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface DoctorRepository {
    public Doctor register(Doctor u);
    public Doctor getDoctorById(int doctorId);
//    public void deleteDoctorbyId(int doctorId);
    public List<Doctor> getDoctor(Map<String,String> params);
    public Doctor updateDoctorRating(Doctor doctor);
}
