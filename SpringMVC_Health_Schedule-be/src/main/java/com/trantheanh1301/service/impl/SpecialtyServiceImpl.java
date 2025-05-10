/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Specialty;
import com.trantheanh1301.repository.SpecialtyRepository;
import com.trantheanh1301.service.SpecialtyService;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author thean
 */

@Service
public class SpecialtyServiceImpl implements SpecialtyService{
    
    
    @Autowired
    private SpecialtyRepository specialtyRepo;

    @Override
    public Specialty getSpecialtyById(int id) {
        return specialtyRepo.getSpecialtyById(id);
    }

    @Override
    public Set<Specialty> getAllSpecialty() {
       return specialtyRepo.getAllSpecialty();
    }

    @Override
    public Specialty addOrUpdate(Specialty specialty) {
       return specialtyRepo.addOrUpdate(specialty);
    }
    
}
