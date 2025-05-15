/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author LAPTOP
 */
@Controller
public class UserController {

    @GetMapping("/login")
    public String loginView(HttpServletRequest request, Model model) {
        model.addAttribute("currentUri", request.getRequestURI());
        return "login";
    }
}
