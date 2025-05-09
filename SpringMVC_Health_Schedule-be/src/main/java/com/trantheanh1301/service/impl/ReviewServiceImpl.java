/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.repository.ReviewRepository;
import com.trantheanh1301.service.ReviewService;
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
    
    @Override
    public Review addReview(Map<String,String> params) {
        
        Doctor doctor = this.DoctorRepository.getDoctorById(Integer.valueOf(params.get("doctorId")));//Lay Doctor
        
        Appointment appointment = this.appointmentRepository.getAppointmentById(Integer.valueOf(params.get("appointmentId"))); //Lay appointment
        
        Patient patient = this.patientRepository.getPatientbyId(Integer.valueOf(params.get("patientId"))); //Lay patient
        
        Review review = new Review();
        review.setAppointmentId(appointment);
        review.setDoctorId(doctor);
        review.setPatientId(patient);
        review.setRating(Short.valueOf(params.get("rating")));
        review.setComment(params.get("comment"));
                
        return this.reviewRepository.addReview(review);
    }

    @Override
    public Review updateResponseReview(Review review, Map<String, String> params) {
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
}
