/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.service.ReviewService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Asus
 */
@RestController
@RequestMapping("/api")
public class ApiReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<?> addReview(@RequestParam Map<String, String> params) {
        try {
            Review r = this.reviewService.addReview(params);
            return new ResponseEntity<>(r, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/review/{id}")
    public ResponseEntity<?> updateResponseReview(@RequestBody Map<String, String> params, @PathVariable("id") int id) {
        try {
            Review r = this.reviewService.getReviewById(id);
            if (r == null) {
                return new ResponseEntity<>("Khong tim thay review", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(this.reviewService.updateResponseReview(r, params), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/reviews/{doctorId}")
    public ResponseEntity<?> getReviewListOfDoctor(@RequestParam Map<String, String> params, @PathVariable("doctorId") int doctorId) {
        try {
            List<Review> reviews = this.reviewService.getReviewListOfDoctor(doctorId, params);
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/reviews")
    public ResponseEntity<?> getReviewLists(@RequestParam Map<String, String> params) {
        try {
            List<Review> reviews = this.reviewService.getReviewLists(params);
            return new ResponseEntity<>(reviews, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
