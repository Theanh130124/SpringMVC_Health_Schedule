/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.repository.ClinicRepository;
import com.trantheanh1301.service.ClinicService;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author thean
 */

@Service
public class ClinicServiceImpl implements  ClinicService{
    
    @Autowired 
    private ClinicRepository clinicRepo;
    
    
    @Override
    public Clinic getClinicById(int id) {
        return clinicRepo.getClinicById(id);
    }

    @Override
    public Set<Clinic> getClinicAll() {
        return clinicRepo.getClinicAll();
    }

    @Override
    public Clinic addOrUpdate(Clinic clinic) {
        return clinicRepo.addOrUpdate(clinic);
    }
    
}
