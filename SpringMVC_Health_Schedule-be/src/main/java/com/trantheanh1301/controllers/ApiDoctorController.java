/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.controllers;

import com.trantheanh1301.dto.DoctorDTO;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.service.DoctorService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.trantheanh1301.mapperdto.DoctorMapper;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;

/**
 *
 * @author LAPTOP
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ApiDoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/doctor")
    public ResponseEntity<?> getListDoctor(@RequestParam Map<String, String> params) {
        try {
            List<Doctor> listDoctor = doctorService.getDoctor(params);

            List<DoctorDTO> dtoList = listDoctor.stream()
                    .map(DoctorMapper::toDoctorDTO) //tương đương  .map(d -> DoctorMapper.toDoctorDTO(d))
                    .collect(Collectors.toList());   // bỏ vào list

            return new ResponseEntity<>(dtoList, HttpStatus.OK);

        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi: " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorById(@PathVariable ("doctorId") int id) {
        try {                 
            return new ResponseEntity<>(this.doctorService.getDoctorById(id), HttpStatus.OK);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Đã xảy ra lỗi: " + ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
