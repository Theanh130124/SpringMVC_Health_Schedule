/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.service.ClinicService;
import com.trantheanh1301.service.SpecialtyService;
import com.trantheanh1301.service.UserService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 *
 * @author LAPTOP
 */
@Controller
public class DoctorController {

    //Tạo tài khoản cho doctor 
    @Autowired
    private UserService userService;

    @Autowired
    private ClinicService clinicService;
    
    @Autowired
    private SpecialtyService specialtyService;

    @GetMapping("/registerdoctor")
    public String register(Model model) {
        model.addAttribute("clinics", clinicService.getClinicAll());
        model.addAttribute("specialties", specialtyService.getAllSpecialty());
        return "registerdoctor";
    }

    @PostMapping("/registerdoctor")
    public String registerDoctor(Model model, @RequestParam Map<String, String> params,
            RedirectAttributes redirectAttrs, @RequestParam(value = "avatar", required = false) MultipartFile avatar
    ) {

        params.put("role", "Doctor");

        if (avatar == null || avatar.isEmpty()) {
            avatar = null;
        }

        User u = this.userService.register(params, avatar); // giả sử hàm register trả về true/false

        //Thêm msg vào redirect vẫn thấy
        if (u != null) {
            redirectAttrs.addFlashAttribute("successMessage", "Đăng ký thành công!");
        } else {
            redirectAttrs.addFlashAttribute("errorMessage", "Đăng ký thất bại. Vui lòng thử lại.");
        }

        return "redirect:/registerdoctor";
    }

}
