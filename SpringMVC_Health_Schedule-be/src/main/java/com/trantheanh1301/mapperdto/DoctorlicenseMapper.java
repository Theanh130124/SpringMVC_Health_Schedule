/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.mapperdto;

import com.trantheanh1301.dto.DoctorlicenseDTO;
import com.trantheanh1301.pojo.Doctorlicense;

/**
 *
 * @author thean
 */
public class DoctorlicenseMapper {
    public static DoctorlicenseDTO toDoctorlicenseDTO(Doctorlicense license){
        if(license == null){
            return null;
        }

        DoctorlicenseDTO licenseDTO = new DoctorlicenseDTO();
        licenseDTO.setLicenseId(license.getLicenseId());
        licenseDTO.setLicenseNumber(license.getLicenseNumber());
        licenseDTO.setIssuingAuthority(license.getIssuingAuthority());
        licenseDTO.setIssueDate(license.getIssueDate());
        licenseDTO.setExpiryDate(license.getExpiryDate());
        licenseDTO.setScopeDescription(license.getScopeDescription());
        licenseDTO.setIsVerified(license.getIsVerified());
        licenseDTO.setCreatedAt(license.getCreatedAt());
        licenseDTO.setUpdatedAt(license.getUpdatedAt());
        licenseDTO.setDoctor(license.getDoctorId());
      
        
        return licenseDTO;
    }
}
