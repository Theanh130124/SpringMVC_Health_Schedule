/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.service.StatsService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @GetMapping("/stats")
    public String stats(Model model ,  @RequestParam Map<String, String> params){
        
        List<Object[]> stats = statsService.statsCountExaminedTotalAmount(params);
        List<Object[]> stats_diagnosis = statsService.statsDiagnosedCountExamined(params);
        
        model.addAttribute("stats",stats);
        model.addAttribute("stats_diagnosis",stats_diagnosis);
        model.addAttribute("params",params);
        
        
        return "stats";
        
    }
}
