
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.permission.Permission;
import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.HealthRecordRepository;
import com.trantheanh1301.service.AppointmentService;
import com.trantheanh1301.service.HealthRecordService;
import com.trantheanh1301.service.PatientService;
import com.trantheanh1301.service.UserService;
import java.security.Principal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
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
        User u = this.userService.getUserById(Integer.valueOf(params.get("userId")));
        if (healthRecordRepository.getHealthRecordByUserId(u.getUserId()) != null) {
            throw new AccessDeniedException("Bạn đã có hồ sơ sức khỏe rồi!");
        }
        h.setUserId(u);//Set truong user
        h.setPatientId(u.getPatient());//Set truong patient                        
        LocalDate localDate = LocalDate.now();
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        h.setRecordDate(date);//Set truong ngay
        h.setSymptoms(params.get("symptoms"));//set truong trieu chung
        h.setNotes(params.get("notes"));//Set truong ghi chu

        return this.healthRecordRepository.addHealthRecord(h);
    }

    @Override
    public Healthrecord getHealthRecordById(int id) {
        return this.healthRecordRepository.getHealthRecordById(id);
    }

    @Override
    public Healthrecord updateHealthRecord(int id, Map<String, String> params, Principal principal) {

        Healthrecord h = this.healthRecordRepository.getHealthRecordById(id);

        User u = this.userService.getUserByUsername(principal.getName());

        LocalDate localDate = LocalDate.now();
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        h.setRecordDate(date);

        if (u.getRole().equals("Doctor")) {

            if (params.get("appointmentId") != null && !params.get("appointmentId").isEmpty()) {
                h.setAppointmentId(this.appointtmentService.getAppointmentById(Integer.valueOf(params.get("appointmentId"))));
                //Kiem tra quyen
                Permission.OwnerHealthRecord(u, h, this.appointtmentService.getAppointmentById(Integer.valueOf(params.get("appointmentId"))));
            }
            if (params.get("prescription") != null && !params.get("prescription").isEmpty()) {
                h.setPrescription(params.get("prescription"));
            }
            if (params.get("diagnosis") != null && !params.get("diagnosis").isEmpty()) {
                h.setDiagnosis(params.get("diagnosis"));
            }
        }

        if (params.get("symptoms") != null && !params.get("symptoms").isEmpty()) {
            h.setSymptoms(params.get("symptoms"));
        }

        if (params.get("notes") != null && !params.get("notes").isEmpty()) {
            h.setNotes(params.get("notes"));
        }

        return this.healthRecordRepository.updateHealthRecord(h);
    }

    @Override
    public Healthrecord getHealthRecordByUserId(Map<String, String> params, Principal principal) {

        User u = this.userService.getUserByUsername(principal.getName());//Lay nguoi dung hien tai = principal
        Healthrecord h = null;
        //Neu day la bac si gui len
        if (u.getRole().equals("Doctor")) {
            h = this.healthRecordRepository.getHealthRecordByUserId(Integer.valueOf(params.get("userId")));//Thi lay healthrecord dua tren id bac si truyen vao
            Appointment a = this.appointtmentService.getAppointmentById(Integer.valueOf(params.get("appointmentId")));
            Permission.OwnerHealthRecord(u, null, a);//Kiem tra xem co phai bac si do kham appointment do hay khong
        } else {
            h = this.healthRecordRepository.getHealthRecordByUserId(u.getUserId());
        }
        return h;
    }

    @Override
    public Healthrecord getHealthRecordByAppointmentId(int id, Principal principal) {
        User u = this.userService.getUserByUsername(principal.getName());
        Healthrecord h = this.healthRecordRepository.getHealthRecordByAppointmentId(id);
        return h;
    }

}
