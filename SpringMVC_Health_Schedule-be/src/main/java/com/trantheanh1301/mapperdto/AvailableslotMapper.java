/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.mapperdto;

import com.trantheanh1301.dto.AvailableslotDTO;
import com.trantheanh1301.dto.DoctorDTO;
import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.pojo.Doctor;

/**
 *
 * @author thean
 */
public class AvailableslotMapper {
    
     public static AvailableslotDTO toDTO(Availableslot slot) {
        if (slot == null) {
            return null;
        }

        Doctor doctor = slot.getDoctorId(); // Lấy entity doctor từ slot
        DoctorDTO doctorDTO = DoctorMapper.toDoctorDTO(doctor); // Dùng DoctorMapper bạn đã có

        AvailableslotDTO dto = new AvailableslotDTO();
        dto.setSlotId(slot.getSlotId());
        dto.setSlotDate(slot.getSlotDate());
        dto.setStartTime(slot.getStartTime());
        dto.setEndTime(slot.getEndTime());
        dto.setIsBooked(slot.getIsBooked());
        dto.setCreatedAt(slot.getCreatedAt());
        
        //Set ở đây để có clinic và speciatly
        dto.setDoctorId(doctorDTO);

        return dto;
    }

    // Cần ngược lại (DTO → Entity), có thể thêm hàm dưới:
//    public static Availableslot toEntity(AvailableslotDTO dto) {
//        if (dto == null) {
//            return null;
//        }
//
//        Availableslot slot = new Availableslot();
//        slot.setSlotId(dto.getSlotId());
//        slot.setSlotDate(dto.getSlotDate());
//        slot.setStartTime(dto.getStartTime());
//        slot.setEndTime(dto.getEndTime());
//        slot.setIsBooked(dto.getIsBooked());
//        slot.setCreatedAt(dto.getCreatedAt());
//
//        // Cẩn thận nếu muốn set doctor entity từ DTO
//        // slot.setDoctorId(DoctorMapper.toEntity(dto.getDoctorDTO()));
//
//        return slot;
//    }

    
}
