/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.mapperdto;

import com.trantheanh1301.dto.ClinicDTO;
import com.trantheanh1301.dto.DoctorDTO;
import com.trantheanh1301.dto.SpecialtyDTO;
import com.trantheanh1301.dto.UserDTO;
import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Specialty;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 *
 * @author thean
 */
//map dto với pojo
public class DoctorMapper {

    public static DoctorDTO toDoctorDTO(Doctor doctor) {
        if (doctor == null) {
            return null;
        }

        DoctorDTO doctorDTO = new DoctorDTO();
        doctorDTO.setDoctorId(doctor.getDoctorId());
        doctorDTO.setYearsExperience(doctor.getYearsExperience());
        doctorDTO.setBio(doctor.getBio());
        doctorDTO.setConsultationFee(doctor.getConsultationFee());
        doctorDTO.setAverageRating(doctor.getAverageRating());

        //Này là n-n
        Set<SpecialtyDTO> listSpecialty = new HashSet<>();
        if (doctor.getSpecialtySet() != null){
            for (Specialty specialty : doctor.getSpecialtySet()){
                listSpecialty.add(SpeciatlyMapper.toSpeciatlyDTO(specialty));
            }
        }
        doctorDTO.setSpecialties(listSpecialty);

         //Này là n-n
        Set<ClinicDTO> listClinic = new HashSet<>();{
        if (doctor.getClinicSet() != null){
            for(Clinic clinic : doctor.getClinicSet()){
                listClinic.add(ClinicMapper.toClinicDTO(clinic));
            }
        }
    }
        doctorDTO.setClinics(listClinic);

        // Map User sang UserDTO 1-1
        UserDTO userDTO = UserMapper.toUserDTO(doctor.getUser());
        doctorDTO.setUserDTO(userDTO);

        return doctorDTO;
    }
}
