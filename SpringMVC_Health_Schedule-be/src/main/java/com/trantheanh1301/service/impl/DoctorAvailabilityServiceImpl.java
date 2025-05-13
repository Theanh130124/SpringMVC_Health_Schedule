/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Doctoravailability;
import com.trantheanh1301.repository.DoctorAvailabilityRepository;
import com.trantheanh1301.repository.DoctorRepository;
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
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private DoctorAvailabilityRepository doctorAvailablityRepo;

    @Override
    public Doctoravailability registerDoctorAvailability(Map<String, String> params) {
        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ !");
        }
        Doctoravailability dvt = new Doctoravailability();
        dvt.setDoctorId(doctor);
        dvt.setDayOfWeek(params.get("dayOfWeek"));
        dvt.setStartTime(DateFormatter.parseTime(params.get("startTime")));
        dvt.setEndTime(DateFormatter.parseTime(params.get("endTime")));
        dvt.setIsAvailable(Boolean.TRUE);
        doctorAvailablityRepo.addOrUpdate(dvt);
        return dvt;
    }

    @Override
    public Doctoravailability updateDoctorAvailability(int id, Map<String, String> params) {
        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ !");
        }
        Doctoravailability dvt = doctorAvailablityRepo.findDoctorAvailabilityById(id);
        if (dvt == null) {
            throw new RuntimeException("Không tìm thấy lịch làm việc trên");
        }
        if (params.containsKey("dayOfWeek")) {
            dvt.setDayOfWeek(params.get("dayOfWeek"));
        }
        if (params.containsKey("startTime")) {
            dvt.setStartTime(DateFormatter.parseTime(params.get("startTime")));
        }
        if (params.containsKey("endTime")) {
            dvt.setEndTime(DateFormatter.parseTime(params.get("endTime")));
        }
        return doctorAvailablityRepo.addOrUpdate(dvt);
    }

    @Override
    public List<Doctoravailability> getAvailability(Map<String,String> params) {
        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ !");
        }
        return doctorAvailablityRepo.listAvailability(doctorId);
    }

}
