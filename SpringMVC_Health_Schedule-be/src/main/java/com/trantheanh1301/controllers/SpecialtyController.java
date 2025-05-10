/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.pojo.Specialty;
import com.trantheanh1301.service.SpecialtyService;
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
@Controller
public class SpecialtyController {

    @Autowired
    private SpecialtyService specialtyService;

    @GetMapping("/createspecialty")
    public String createSpecialtyView(Model model) {
        model.addAttribute("specialty", new Specialty());
        return "createspecialty";
    }

    @PostMapping("/addspecialty")
    public String addSpecialty(@ModelAttribute(value = "specialty") Specialty specialty,
            RedirectAttributes redirectAttrs) {
        Specialty s = this.specialtyService.addOrUpdate(specialty);
        if (s != null) {
            redirectAttrs.addFlashAttribute("successMessage", "Tạo chuyên khoa thành công!");
        } else {
            redirectAttrs.addFlashAttribute("errorMessage", "Tạo chuyên khoa thất bại. Vui lòng thử lại.");
        }
        return "redirect:/createspecialty";
    }
}
