/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.permission.Permission;
import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.AvailabeslotRepository;
import com.trantheanh1301.repository.ClinicRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.service.AppointmentService;
import com.trantheanh1301.service.InvoiceService;
import com.trantheanh1301.service.PaymentService;
import com.trantheanh1301.service.UserService;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.NotFoundException;

import java.security.Principal;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private UserService userService;

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

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private InvoiceService invoiceService;

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

        Availableslot slot = slotRepo.getSlotByDoctorId(doctorId, time, false);
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

        emailService.sendAppointmentConfirmation(patient.getUser().getEmail(), "Xác nhận đặt lịch hẹn",
                patient.getUser().getFirstName() + patient.getUser().getLastName(),
                doctor.getUser().getFirstName() + doctor.getUser().getLastName(),
                appointment.getAppointmentTime().toString());
        emailService.sendAppointmentConfirmationtoDoctor(appointment.getDoctorId().getUser().getEmail(), "Thông báo đến bác sĩ có Bệnh nhân đặt lịch khám", appointment.getDoctorId().getUser().getFirstName() + appointment.getDoctorId().getUser().getLastName(),
                appointment.getPatientId().getUser().getFirstName() + appointment.getPatientId().getUser().getLastName(), appointment.getAppointmentTime().toString());
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

    @Override
    public Appointment updateAppointment(int id, Map<String, String> params, Principal principal) {

        //Permission chi tiet
        User current_user = userService.getUserByUsername(principal.getName());
        Appointment appointment = appointmentRepo.getAppointmentById(id);
        if (appointment == null) {
            throw new RuntimeException("Không tìm thấy lịch hẹn trên");
        }
        Permission.OwnerAppointment(current_user, appointment);

        if (!params.containsKey("doctorId") || params.get("doctorId") == null) {
            throw new RuntimeException("Thiếu thông tin bác sĩ (doctorId)");
        }

        Integer doctorId = Integer.valueOf(params.get("doctorId"));

        if (appointment.getCreatedAt() != null) {
            Date date_now = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(appointment.getCreatedAt());
            cal.add(Calendar.HOUR_OF_DAY, 24);

            //Qúa 24h sẽ không cho sửa -> Nhưng phải thực hiện set lịch hiện tại về chưa book 
            //và lịch book thành đã book (theo thời gian đã chọn)
            if (cal.getTime().after(date_now)) {

                if (params.containsKey("time")) {
                    String timeStr = params.get("time");
                    Date newTime = DateFormatter.parseDateTime(timeStr); //format cho thời gian gửi lên server
                    //Time cũ
                    Date time_old = appointment.getAppointmentTime();
                    //Thực hiện update slot cũ về false -> chưa book
                    Availableslot slot_old = slotRepo.getSlotByDoctorId(doctorId, time_old, true);
                    if (slot_old == null) {
                        throw new RuntimeException("Lịch chưa được đặt nên không được sửa!");
                    }
                    slot_old.setIsBooked(false);
                    slotRepo.addOrUpdate(slot_old);

                    //(Time mới) appointment_time -> phải là thời gian trống còn lại của bác sĩ
                    appointment.setAppointmentTime(newTime);
                    //Thực hiện update slot mới -> cho lịch tương ứng
                    Availableslot slot_new = slotRepo.getSlotByDoctorId(doctorId, newTime, false);
                    if (slot_new == null) {
                        throw new RuntimeException("Lịch đã được đặt!");
                    }
                    slot_new.setIsBooked(true);
                    slotRepo.addOrUpdate(slot_new);
                }
                if (params.containsKey("reason")) {
                    appointment.setReason(params.get("reason"));
                }

            } else {
                throw new RuntimeException("Không thể xóa lịch hẹn quá 24 giờ");
            }
        }
        //Cập nhật lịch khám
        appointmentRepo.addOrUpdate(appointment);

        emailService.sendAppointmentConfirmation(appointment.getPatientId().getUser().getEmail(), "Xác nhận sửa lịch hẹn",
                appointment.getPatientId().getUser().getFirstName() + appointment.getPatientId().getUser().getLastName(),
                appointment.getDoctorId().getUser().getFirstName() + appointment.getDoctorId().getUser().getLastName(),
                appointment.getAppointmentTime().toString());

        emailService.sendAppointmentConfirmationtoDoctor(appointment.getDoctorId().getUser().getEmail(), "Thông báo đến bác sĩ có Bệnh nhân sửa lịch hẹn", appointment.getDoctorId().getUser().getFirstName() + appointment.getDoctorId().getUser().getLastName(),
                appointment.getPatientId().getUser().getFirstName() + appointment.getPatientId().getUser().getLastName(), appointment.getAppointmentTime().toString());

        return appointment;
    }

    @Override
    public void deleteAppointment(Map<String, String> params, int id, Principal principal) {
        Appointment a = appointmentRepo.getAppointmentById(id);
        User current_user = userService.getUserByUsername(principal.getName());
        if (a == null) {
            throw new RuntimeException("Không tìm thấy appointment trên để xóa");
        }
        Integer doctorId = Integer.valueOf(params.get("doctorId"));
        Doctor doctor = doctorRepo.getDoctorById(doctorId);
        if (doctor == null) {
            throw new RuntimeException("Không tìm thấy bác sĩ");
        }
        //Xóa lịch cũng cần cập nhật slot trổng đó cho người khác đăt

        Permission.OwnerAppointment(current_user, a);
        if (a.getCreatedAt() != null) {
            Date date_now = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(a.getCreatedAt());
            cal.add(Calendar.HOUR_OF_DAY, 24);

            if (cal.getTime().after(date_now)) {
                Date time_old = a.getAppointmentTime();
                Availableslot slot_old = slotRepo.getSlotByDoctorId(doctorId, time_old, true);
                if (slot_old == null) {
                    throw new RuntimeException("Lịch chưa được đặt nên không thể hủy lịch!");
                }
                slot_old.setIsBooked(false);
                slotRepo.addOrUpdate(slot_old);
            } else {
                throw new RuntimeException("Không thể sữa lịch hẹn quá 24 giờ");
            }
        }
        emailService.sendAppointmentConfirmation(a.getPatientId().getUser().getEmail(), "Xác nhận hủy lịch hẹn",
                a.getPatientId().getUser().getFirstName() + a.getPatientId().getUser().getLastName(),
                doctor.getUser().getFirstName() + doctor.getUser().getLastName(),
                a.getAppointmentTime().toString());
        emailService.sendAppointmentConfirmationtoDoctor(a.getDoctorId().getUser().getEmail(), "Thông báo đến bác sĩ có Bệnh nhân hủy lịch khám", a.getDoctorId().getUser().getFirstName() + a.getDoctorId().getUser().getLastName(),
                a.getPatientId().getUser().getFirstName() + a.getPatientId().getUser().getLastName(), a.getAppointmentTime().toString());
        appointmentRepo.delete(a);
    }
//Phần nhắc nhở lịch hẹn

    @Override
    @Scheduled(fixedRate = 12 * 60 * 60 * 1000) // chạy mỗi 12 giờ
    public void sendAppoinmetReminders() {
        Date now = new Date();
        Calendar startCal = Calendar.getInstance();
        startCal.add(Calendar.DAY_OF_YEAR, 1); // bắt đầu từ ngày mai
        Date start = startCal.getTime();

        Calendar endCal = Calendar.getInstance();
        endCal.setTime(now);
        endCal.add(Calendar.DAY_OF_YEAR, 2); // đến ngày kia
        Date end = endCal.getTime();

        List<Appointment> appoinments = appointmentRepo.findAppointmentBetween(start, end);
        for (Appointment appt : appoinments) {
            //Lịch nếu đang ở Schedule
            if ("Scheduled".equals(appt.getStatus())) {
                String email = appt.getPatientId().getUser().getEmail();
                String subject = "Nhắc nhở lịch khám bệnh của bạn";
                String content = "Bạn có lịch hẹn vào lúc" + appt.getAppointmentTime();

                emailService.sendAppointmentConfirmation(email, subject, appt.getPatientId().getUser().getFirstName() + appt.getPatientId().getUser().getLastName(),
                        appt.getDoctorId().getUser().getFirstName() + appt.getDoctorId().getUser().getLastName(),
                        content);
            }
        }
    }

    @Override
    public Appointment updateStatusAppointment(int id, Map<String, String> params, Principal principal) {
        Appointment a = this.appointmentRepo.getAppointmentById(id);
        System.out.println(a);
        User u = this.userService.getUserByUsername(principal.getName());
        if (a == null) {
            throw new RuntimeException("Không tìm thấy lịch hẹn");
        }

        if (a.getAppointmentTime() != null && a.getAppointmentTime().after(new Date())) {
            throw new RuntimeException("Không thể cập nhật trạng thái trước ngày khám");
        }

        Permission.OwnerDoctorAppointment(u, a);
        a.setStatus(params.get("status"));

        Payment payment = paymentService.getPaymentByInvoiceId(a.getInvoice().getInvoiceId(), principal);

        if (payment == null) {
            throw new RuntimeException("Bệnh nhân chưa tạo thanh toán");
        }

        if (!payment.getStatus().equals("Completed")) {
            throw new RuntimeException("Bệnh nhân chưa hoàn thành thanh toán");
        }

        //Neu la bac si cua lich hen do va phuong thuc thanh toan la tien mat thi cap nhat luon hoa don va thanh toan
        if (payment.getPaymentMethod().equals("Cash")) {
            invoiceService.updatePaymentStatusInvoice(a.getInvoice().getInvoiceId(), Map.of("status", "Paid"));

            String transId = generateTransactionId(String.valueOf(a.getInvoice().getInvoiceId()), String.valueOf(payment.getPaymentId()));
            paymentService.updatePayment(payment.getPaymentId(), Map.of(
                    "status", "Completed",
                    "transactionId", transId
            ));
        }

        return this.appointmentRepo.addOrUpdate(a);
    }

    private String generateTransactionId(String invoiceId, String paymentId) {
        // Tạo tiền tố ngẫu nhiên gồm 10 chữ số
        String randomPrefix = String.valueOf((long) (Math.random() * 1_000_000_0000L));

        // Đảm bảo độ dài tiền tố luôn là 10 chữ số
        while (randomPrefix.length() < 10) {
            randomPrefix = "0" + randomPrefix;
        }

        return randomPrefix + invoiceId + paymentId;  // VD: 12345678900581
    }

}
