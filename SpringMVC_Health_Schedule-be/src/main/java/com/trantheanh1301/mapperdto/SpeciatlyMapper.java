/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.mapperdto;

import com.trantheanh1301.dto.SpecialtyDTO;
import com.trantheanh1301.pojo.Specialty;

/**
 *
 * @author thean
 */
public class SpeciatlyMapper {
    public static SpecialtyDTO toSpeciatlyDTO(Specialty specialty){
        SpecialtyDTO specialtyDTO = new SpecialtyDTO();
        specialtyDTO.setSpecialtyId(specialty.getSpecialtyId());
        specialtyDTO.setDescription(specialty.getDescription());
        specialtyDTO.setName(specialty.getName());
        return specialtyDTO;
        
    }
}
