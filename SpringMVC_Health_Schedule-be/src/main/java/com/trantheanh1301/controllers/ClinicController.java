/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.service.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 *
 * @author thean
 */

//Admin tao phong kham cho he thong
@Controller
public class ClinicController {
    
   @Autowired 
   private ClinicService clinicService;
   
   @GetMapping("/createclinic")
   public String createClinicView(Model model){
       //Phải có đối tượng rỗng
       model.addAttribute("clinic",new Clinic());
       return "createclinic";
   }
   
   @PostMapping("/addclinic")
   public String addClinic(@ModelAttribute(value ="clinic") Clinic clinic ,
            RedirectAttributes redirectAttrs){
      Clinic c = this.clinicService.addOrUpdate(clinic);
       if(c != null){
           redirectAttrs.addFlashAttribute("successMessage", "Tạo phòng khám thành công!");
       }else{
           redirectAttrs.addFlashAttribute("errorMessage", "Tạo phòng khám thất bại. Vui lòng thử lại.");
       }
       return "redirect:/createclinic";
   }
    
}
