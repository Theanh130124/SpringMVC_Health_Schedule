/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.UserService;
import com.trantheanh1301.utils.JwtUtils;
import jakarta.ws.rs.core.MediaType;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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
    


    //required = false không bắt buộc lấy avatar trong RequestPârams
    @PostMapping(path = "/users", consumes = MediaType.MULTIPART_FORM_DATA)
    // trả ? để in đc error
    public ResponseEntity<?> register(@RequestParam Map<String, String> params,
            @RequestParam(value = "avatar" ) MultipartFile avatar) {
        try {
            User u = this.userDetailsService.register(params, avatar);
            return new ResponseEntity<>(u, HttpStatus.CREATED);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    
    @PatchMapping(path = "/user/{username}", consumes = MediaType.MULTIPART_FORM_DATA)
    // trả ? để in đc error
    public ResponseEntity<?> updateUser(@PathVariable ("username") String username,@RequestParam Map<String, String> params,@RequestParam(value = "avatar" ) MultipartFile avatar) {
        try {
            User u = this.userDetailsService.updateUser(username, params, avatar);
            return new ResponseEntity<>(u, HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    

    //lấy token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        if (this.userDetailsService.authenticate(u.getUsername(), u.getPassword())) {
            try {
                //Lấy ra để nó tự gán role -> mình không truyền vào body
                User user = userDetailsService.getUserByUsername(u.getUsername());
                //Cấu hình tất cả các role -> login lấy ra role luôn (jwt phân biệt) 
                List<String> roles = List.of(user.getRole());
                String token = JwtUtils.generateToken(user.getUsername(), roles);
                return ResponseEntity.ok().body(Collections.singletonMap("token", token));

            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");

    }

    //Là current -user
    @RequestMapping("/secure/profile")
    @ResponseBody
    public ResponseEntity<User> getProfile(Principal principal) {
        return new ResponseEntity<>(this.userDetailsService.getUserByUsername(principal.getName()), HttpStatus.OK);
    }
    
    @PatchMapping("/user/change-password/{username}")
    // trả ? để in đc error
    public ResponseEntity<?> changePassword(@PathVariable ("username") String username,@RequestParam Map<String, String> params) {
        try {
            Map<String, Object> res = this.userDetailsService.changePassword(username, params);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    
}
