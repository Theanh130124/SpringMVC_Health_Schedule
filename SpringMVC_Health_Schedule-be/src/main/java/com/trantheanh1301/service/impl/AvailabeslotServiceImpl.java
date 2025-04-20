/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.repository.AvailabeslotRepository;
import com.trantheanh1301.service.AvailabeslotService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */

@Service
public class AvailabeslotServiceImpl implements AvailabeslotService{

    @Autowired
    private AvailabeslotRepository availableslotRepo;
    
    
    @Override
    public List<Availableslot> findSlot(Map<String, String> params) {
      return availableslotRepo.findSlot(params);
    }
    
}
