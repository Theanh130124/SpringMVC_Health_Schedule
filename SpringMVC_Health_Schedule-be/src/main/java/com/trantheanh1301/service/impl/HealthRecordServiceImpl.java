
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.repository.HealthRecordRepository;
import com.trantheanh1301.service.AppointmentService;
import com.trantheanh1301.service.HealthRecordService;
import com.trantheanh1301.service.PatientService;
import com.trantheanh1301.service.UserService;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Asus
 */
@Service
public class HealthRecordServiceImpl implements HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointtmentService;

    @Autowired
    private UserService userService;

    @Override
    public Healthrecord addHealthRecord(Map<String, String> params) {

        Healthrecord h = new Healthrecord();
        h.setPatientId(this.patientService.getPatientById(Integer.valueOf(params.get("patientId"))));

        //Neu co lich su kham benh thi them, khong thi chi tao ho so binh thuong
        if (params.get("appointmentId") != null && !params.get("appointmentId").isEmpty()) {
            h.setAppointmentId(this.appointtmentService.getAppointmentById(Integer.valueOf(params.get("appointmentId"))));
        } else {
            h.setAppointmentId(null);
        }

        h.setUserId(this.userService.getUserById(Integer.valueOf(params.get("userId"))));
        LocalDate localDate = LocalDate.now(); 
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        h.setRecordDate(date);
        h.setSymptoms(params.get("symptoms"));
        h.setDiagnosis(params.get("diagnosis"));
        h.setPrescription(params.get("prescription"));
        h.setNotes(params.get("notes"));

        return this.healthRecordRepository.addHealthRecord(h);
    }

    @Override
    public Healthrecord getHealthRecordById(int id) {
        return this.healthRecordRepository.getHealthRecordById(id);
    }

    @Override
    public Healthrecord updateHealthRecord(int id, Map<String, String> params) {

        Healthrecord h = this.healthRecordRepository.getHealthRecordById(id);
        LocalDate localDate = LocalDate.now(); 
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        h.setRecordDate(date);
        h.setSymptoms(params.get("symptoms"));
        h.setDiagnosis(params.get("diagnosis"));
        h.setPrescription(params.get("prescription"));
        h.setNotes(params.get("notes"));
        
        return this.healthRecordRepository.updateHealthRecord(h);
    }

}
