/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author LAPTOP
 */
public interface UserService extends UserDetailsService{
    User getUserByUsername(String username);
    User register(Map<String, String> params, MultipartFile avatar);
    boolean authenticate(String username, String password);
    User getUserById(int id);
}
