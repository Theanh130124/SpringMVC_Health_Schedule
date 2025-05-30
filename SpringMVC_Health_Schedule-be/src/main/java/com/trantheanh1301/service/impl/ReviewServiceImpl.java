/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.permission.Permission;
import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.repository.ReviewRepository;
import com.trantheanh1301.service.ReviewService;
import com.trantheanh1301.service.UserService;
import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Asus
 */
@Service
public class ReviewServiceImpl implements ReviewService{
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private DoctorRepository DoctorRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public Review addReview(Map<String,String> params, Principal principal) {                   
        Appointment appointment = this.appointmentRepository.getAppointmentById(Integer.valueOf(params.get("appointmentId"))); //Lay appointment
        
        if(appointment==null){
            throw new Error("Không tìm thấy Appointment");
        }
        
        Review reviewTest = this.getReviewByAppointmentId(appointment.getAppointmentId());
        if(reviewTest!=null){
            throw new Error("Bạn đã đánh giá rồi");
        }
        
        User user = userService.getUserByUsername(principal.getName());//Nguoi dung nay phai la benh nhan
        
        if(user==null){
            throw new Error("Không tìm thấy User");
        }
        
        Permission.OwnerAppointment(user, appointment);
        
        Doctor doctor = appointment.getDoctorId();//Lay doctor
               
        Patient patient = user.getPatient(); //Lay patient
        
        if(patient==null){
            throw new Error("Không tìm thấy User");
        }
        
        Review review = new Review();
        review.setAppointmentId(appointment);
        review.setDoctorId(doctor);
        review.setPatientId(patient);
        review.setRating(Short.valueOf(params.get("rating")));
        review.setComment(params.get("comment"));                
        return this.reviewRepository.addReview(review);
    }

    @Override
    public Review updateResponseReview(Review review, Map<String, String> params, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());//Nguoi dung nay phai la benh nhan
        
        if(user==null){
            throw new Error("Không tìm thấy User");
        }             
        Permission.OwnerAppointmentDoctor(user, review.getAppointmentId());      
        String comment = params.get("doctorResponse");       
        review.setDoctorResponse(comment);
        review.setResponseDate(Timestamp.from(Instant.now()));
        return this.reviewRepository.updateResponseReview(review);
    }

    @Override
    public Review getReviewById(int id) {
        return this.reviewRepository.getReviewById(id);
    }
    
    @Override
    public List<Review> getReviewListOfDoctor(int doctorId, Map<String, String> params){
        return this.reviewRepository.getReviewListOfDoctor(doctorId, params);
    }

    @Override
    public List<Review> getReviewLists(Map<String, String> params) {
        return this.reviewRepository.getReviewLists(params);
    }
    
    @Override
    public Review getReviewByAppointmentId(int id){
        return this.reviewRepository.getReviewByAppointmentId(id);
    }
}
