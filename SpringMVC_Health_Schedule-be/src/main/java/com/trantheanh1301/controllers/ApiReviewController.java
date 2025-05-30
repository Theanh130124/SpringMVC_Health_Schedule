/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.formatter.ErrorResponseFormatter;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.service.ReviewService;
import jakarta.persistence.NoResultException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('Patient')")
    @PostMapping("/review")
    public ResponseEntity<?> addReview(@RequestParam Map<String, String> params, Principal principal) {
        try {
            Review r = this.reviewService.addReview(params, principal);
            return new ResponseEntity<>(r, HttpStatus.CREATED);
        } catch (Error ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (AccessDeniedException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage()); //Nó sẽ lấy thông báo khi ném ra ngoại lệ ở bên permission
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAuthority('Doctor')")
    @PatchMapping("/review/{id}")
    public ResponseEntity<?> updateResponseReview(@RequestBody Map<String, String> params, @PathVariable("id") int id, Principal principal) {
        try {
            Review r = this.reviewService.getReviewById(id);
            if (r == null) {
                throw new NoResultException("Không tìm thấy Review");
            }
            return new ResponseEntity<>(this.reviewService.updateResponseReview(r, params, principal), HttpStatus.OK);
        } catch (NoResultException e) {
            Map<String, String> m = new HashMap<>();
            m.put("error", e.getMessage());
            return new ResponseEntity<>(m, HttpStatus.NOT_FOUND);
        } catch (AccessDeniedException e) {
            Map<String, String> m = new HashMap<>();
            m.put("error", e.getMessage());
            return new ResponseEntity<>(m, HttpStatus.FORBIDDEN);
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

    @GetMapping("/reviews/appointment/{id}")
    public ResponseEntity<?> getReviewByAppointmentId(@PathVariable("id") int id) {
        try {
            return new ResponseEntity<>(this.reviewService.getReviewByAppointmentId(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponseFormatter("Đã xảy ra lỗi: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
