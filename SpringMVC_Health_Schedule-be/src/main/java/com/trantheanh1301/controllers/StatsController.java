/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.StatsService;
import com.trantheanh1301.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author LAPTOP
 */
@Controller
public class StatsController {

    @Autowired
    private StatsService statsService;
    @Autowired 
    private UserService userService;
    //Xem lại permisstion viết ở controller có hợp lý không ?
    
   
    @GetMapping("/stats")
    public String stats(Model model ,  @RequestParam Map<String, String> params , @AuthenticationPrincipal User user){
        
        List<Object[]> stats_admin = statsService.statsCountExaminedTotalAmount(params);
        List<Object[]> stats_doctor = statsService.statsDiagnosedCountExamined(params);
        
        model.addAttribute("stats_admin",stats_admin);
        model.addAttribute("stats_doctor",stats_doctor);
        model.addAttribute("params",params);
        
        
        return "stats";
        
        
    }
    
    
}
