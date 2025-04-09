/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import java.util.Map;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
/**
 *
 * @author LAPTOP
 */
@Controller
@ControllerAdvice
public class IndexController {
    
   
    //Dùng chung nhiều trang
    
//    @ModelAttribute
//    public void commonResponse(Model model) {
//        model.addAttribute("categories", this.cateSer.getCates());
//    }
    @RequestMapping("/")
    public String index(Model model) { //, @RequestParam Map<String, String> params
        
        model.addAttribute("msg","Xin chao the anh" );
        return "index";
}
}
