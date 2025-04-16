/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.UserService;
import jakarta.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author LAPTOP
 */
@RestController
@RequestMapping("/api")
public class ApiUserController {

    @Autowired
    private UserService userDetailsService;

    //Try catch chỗ này cho nó hiện lỗi chi tiết là gì đỡ vào log check
    @PostMapping(path = "/users", consumes = MediaType.MULTIPART_FORM_DATA)
    // trả ? để in đc error
    public ResponseEntity<?> register(@RequestParam Map<String, String> params,
            @RequestParam(value = "avatar") MultipartFile avatar) {
        try {
            User u = this.userDetailsService.register(params, avatar);
            return new ResponseEntity<>(u, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
