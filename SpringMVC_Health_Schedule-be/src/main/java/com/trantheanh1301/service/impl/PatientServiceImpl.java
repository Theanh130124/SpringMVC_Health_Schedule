/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */
@Service
public class PatientServiceImpl implements PatientService{

    @Autowired
    private PatientRepository patientRepo;
    
    @Override
    public Patient register(Patient u) {
        return patientRepo.register(u);
    }

    @Override
    public Patient getPatientById(int id) {
        return this.patientRepo.getPatientbyId(id);
    }
    
}
