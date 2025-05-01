/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.AvailabeslotRepository;
import com.trantheanh1301.repository.ClinicRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.service.AppointmentService;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private ClinicRepository clinicRepo;

    @Autowired
    private AvailabeslotRepository slotRepo;
    
    @Autowired
    private EmailServiceImpl emailService;

    
    //nữa fe cần có ds các bs,clinic,patient...
    @Override
    public Appointment registerAppointment(Map<String, String> params) {
        Integer patientId = Integer.valueOf(params.get("patientId"));
        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Integer clinicId = Integer.valueOf(params.get("clinicId"));
        Patient patient = patientRepo.getPatientbyId(patientId);
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        Clinic clinic = clinicRepo.getClinicById(clinicId);

        if (patient == null) {
            throw new RuntimeException("Không tìm thấy bênh nhân");
        }
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ");
        }
        if (clinic == null) {
            throw new RuntimeException("Không tìm thấy phòng khám ");
        }

        Date time = Timestamp.valueOf(params.get("time"));

        Availableslot slot = slotRepo.getSlotbyDoctorId(doctorId, time);
        if (slot == null || slot.getIsBooked()) {
            throw new RuntimeException("Lịch đã được đặt!");
        }
        slot.setIsBooked(true);
        
        //Cập nhật slot 
        slotRepo.addOrUpdate(slot);

        Appointment appointment = new Appointment();
        appointment.setPatientId(patient);
        appointment.setDoctorId(doctor);
        appointment.setClinicId(clinic);
        appointment.setAppointmentTime(time);
        appointment.setDurationMinutes(Integer.valueOf(params.get("duration")));
        appointment.setReason(params.get("reason"));
        appointment.setStatus("Scheduled");
        appointment.setConsultationType(params.get("type"));
        
        //Cập nhật lịch khám
        appointmentRepo.addOrUpdate(appointment);
       
        
        emailService.sendAppointmentConfirmation(patient.getUser().getEmail(),
                patient.getUser().getFirstName() +patient.getUser().getLastName(),
                doctor.getUser().getFirstName() + doctor.getUser().getLastName(),
                appointment.getAppointmentTime().toString());
        
        return appointment;
    }

    @Override
    public List<Appointment> getListAppointment(Map<String, String> params) {
      return appointmentRepo.getListAppointment(params);
    }

    @Override
    public Appointment getAppointmentById(int id) {
        return this.appointmentRepo.getAppointmentById(id);
    }

}
