/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Doctorlicense;
import com.trantheanh1301.repository.DoctorLicenseRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.service.DoctorLicenseService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */
@Service
public class DoctorLicenseServiceImpl implements DoctorLicenseService {

    @Autowired
    private DoctorLicenseRepository licenseRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    @Override
    public Doctorlicense registerLicense(Map<String, String> params) {

        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ!");
        }
        Doctorlicense license = new Doctorlicense();
        //nó set đối tượng -> có thể đổi tên bên pojo lại (đã đổi)
        license.setDoctorId(doctor);
        license.setLicenseNumber(params.get("licenseNumber"));
        license.setIssuingAuthority(params.get("issuingAuthority"));
        license.setIssueDate(DateFormatter.parseDate(params.get("issuedDate")));
        license.setExpiryDate(DateFormatter.parseDate(params.get("expiryDate")));
        license.setScopeDescription(params.get("scopeDescription"));
        licenseRepo.registerLicense(license);
        return license;

    }

    @Override
    public Doctorlicense updateLicese(int id, Map<String, String> params) {

        Doctorlicense license = licenseRepo.getLicenById(id);
        if (license == null) {
            throw new RuntimeException("Không tìm thấy chứng chỉ hành nghề trên !");
        }
        //đã được admin duyệt rồi 
        if (license.getIsVerified()) {
            throw new RuntimeException("Giấy phép đã xét duyệt không thể chỉnh sửa!");
        }
        if (params.containsKey("licenseNumber")) {
            license.setLicenseNumber(params.get("licenseNumber"));
        }

        // Cập nhật các trường khác chỉ nếu có trong params
        if (params.containsKey("issuingAuthority")) {
            license.setIssuingAuthority(params.get("issuingAuthority"));
        }
        if (params.containsKey("issuedDate")) {
            license.setIssueDate(DateFormatter.parseDate(params.get("issuedDate")));
        }
        if (params.containsKey("expiryDate")) {
            license.setExpiryDate(DateFormatter.parseDate(params.get("expiryDate")));
        }
        if (params.containsKey("scopeDescription")) {
            license.setScopeDescription(params.get("scopeDescription"));
        }
        return licenseRepo.updateLicese(license);
    }

}
