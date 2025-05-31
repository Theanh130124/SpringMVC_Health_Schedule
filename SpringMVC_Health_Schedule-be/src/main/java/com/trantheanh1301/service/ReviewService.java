/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Review;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Asus
 */
public interface ReviewService {
    public Review addReview(Map<String,String> params, Principal principal);
    public Review updateResponseReview(Review review, Map<String, String> params, Principal principal);
    public Review getReviewById(int id);
    public List<Review> getReviewListOfDoctor(int doctorId, Map<String, String> params);
    public List<Review> getReviewLists(Map<String, String> params);
    public Review getReviewByAppointmentId(int id);
    public Double getAVGRatingDoctor(int doctorId);
   
}
