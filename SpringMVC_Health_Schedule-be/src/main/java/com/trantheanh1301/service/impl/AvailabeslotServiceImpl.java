/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.dto.AvailableslotDTO;
import com.trantheanh1301.dto.DoctorDTO;
import com.trantheanh1301.mapperdto.AvailableslotMapper;
import com.trantheanh1301.mapperdto.DoctorMapper;
import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.repository.AvailabeslotRepository;
import com.trantheanh1301.service.AvailabeslotService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author LAPTOP
 */

@Service
@Transactional
public class AvailabeslotServiceImpl implements AvailabeslotService{

    @Autowired
    private AvailabeslotRepository availableslotRepo;
    
    //Xử lý DTO
   @Override
    public List<AvailableslotDTO> findSlot(Map<String, String> params) {
        List<Availableslot> slots = availableslotRepo.findSlot(params);
        return slots.stream()
                    .map(AvailableslotMapper::toDTO)
                    .toList();
    
    }
    
}
