/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Doctorlicense;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.DoctorLicenseService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author LAPTOP
 */
@Controller
public class LicenseController {

    @Autowired
    private DoctorLicenseService licenseService;

    
    
    @RequestMapping("/license")
    public String license(Model model , @RequestParam Map<String, String> params , @AuthenticationPrincipal User user){
       model.addAttribute("license",this.licenseService.loadLicense(params));
        return "license";
    }
    
    
    
    @RequestMapping("/license/{licenseId}")
    public String updateLicense(Model model, @PathVariable(value="licenseId") int id, @RequestParam Map<String, String> params, @AuthenticationPrincipal User user) {

        licenseService.updateLicense(id, params);
        return "redirect:/license";
    }

}
