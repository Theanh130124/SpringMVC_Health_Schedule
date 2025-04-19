/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Doctoravailability;
import com.trantheanh1301.repository.DoctorAvailabilityRepository;
import com.trantheanh1301.service.DoctorAvailabilityService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */

@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService{

    
    @Autowired
    private DoctorAvailabilityRepository doctorAvailablityRepo;
    
    //get thôi không xử lý
    @Override
    public List<Doctoravailability> findAvailableTime(Map<String, String> params) {
       return doctorAvailablityRepo.findAvailableTime(params);
    }
    
}
