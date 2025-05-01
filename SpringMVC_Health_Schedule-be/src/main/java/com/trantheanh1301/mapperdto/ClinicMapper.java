/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.mapperdto;

import com.trantheanh1301.dto.ClinicDTO;
import com.trantheanh1301.pojo.Clinic;

/**
 *
 * @author thean
 */
public class ClinicMapper {
     public static ClinicDTO toClinicDTO(Clinic clinic){
        ClinicDTO clinicDTO = new ClinicDTO();
        clinicDTO.setClinicId(clinic.getClinicId());
        clinicDTO.setName(clinic.getName());
        clinicDTO.setAddress(clinic.getAddress());
        clinicDTO.setPhoneNumber(clinic.getPhoneNumber());
        clinicDTO.setWebsite(clinic.getWebsite());
        clinicDTO.setCreatedAt(clinic.getCreatedAt());
        clinicDTO.setUpdatedAt(clinic.getUpdatedAt());
        return clinicDTO;
        
    }
}
