/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.service.DoctorService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */

@Service
public class DoctorServiceImpl implements DoctorService{
    
    @Autowired
    private DoctorRepository doctorRepo;

    @Override
    public Doctor register(Doctor u) {
       return doctorRepo.register(u);
    }

    @Override
    public Doctor getDoctorById(int doctorId) {
       return doctorRepo.getDoctorById(doctorId);
    }

    @Override
    public List<Doctor> getDoctor(Map<String, String> params) {
       return doctorRepo.getDoctor(params);
    }

    @Override
    public Doctor updateDoctorRating(int doctorId) {       
        return this.doctorRepo.updateDoctorRating(this.getDoctorById(doctorId));
    }
    
}
