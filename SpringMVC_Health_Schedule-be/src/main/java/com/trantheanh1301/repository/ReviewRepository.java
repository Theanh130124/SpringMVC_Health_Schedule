/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Review;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Asus
 */
public interface ReviewRepository {
    public Review addReview(Review review);
    public Review updateResponseReview(Review view);
    public Review getReviewById(int id);
    public List<Review> getReviewListOfDoctor(int doctorId, Map<String, String> params);
    public List<Review> getReviewLists(Map<String, String> params);
}
