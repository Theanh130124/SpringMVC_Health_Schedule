/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.dto;

import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author thean
 */
//Dùng cho mấy trường hợp n-n không @JsonIgnore được
public class DoctorDTO {

    private Integer doctorId;
    private Integer yearsExperience;
    private String bio;
    private BigDecimal consultationFee;
    private BigDecimal averageRating;

    private Set<SpecialtyDTO> specialties;
    private Set<ClinicDTO> clinics;
    private UserDTO userDTO; // Kết nối DoctorDTO với UserDTO

    public DoctorDTO(Integer doctorId, Integer yearsExperience, String bio, BigDecimal consultationFee, BigDecimal averageRating, Set<SpecialtyDTO> specialties, Set<ClinicDTO> clinics, UserDTO userDTO) {
        this.doctorId = doctorId;
        this.yearsExperience = yearsExperience;
        this.bio = bio;
        this.consultationFee = consultationFee;
        this.averageRating = averageRating;
        this.specialties = specialties;
        this.clinics = clinics;
        this.userDTO = userDTO;
    }


    

    public DoctorDTO() {
    }

    /**
     * @return the doctorId
     */
    public Integer getDoctorId() {
        return doctorId;
    }

    /**
     * @param doctorId the doctorId to set
     */
    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    /**
     * @return the yearsExperience
     */
    public Integer getYearsExperience() {
        return yearsExperience;
    }

    /**
     * @param yearsExperience the yearsExperience to set
     */
    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    /**
     * @return the bio
     */
    public String getBio() {
        return bio;
    }

    /**
     * @param bio the bio to set
     */
    public void setBio(String bio) {
        this.bio = bio;
    }

    /**
     * @return the consultationFee
     */
    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    /**
     * @param consultationFee the consultationFee to set
     */
    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    /**
     * @return the averageRating
     */
    public BigDecimal getAverageRating() {
        return averageRating;
    }

    /**
     * @param averageRating the averageRating to set
     */
    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    /**
     * @return the specialties
     */
    public Set<SpecialtyDTO> getSpecialties() {
        return specialties;
    }

    /**
     * @param specialties the specialties to set
     */
    public void setSpecialties(Set<SpecialtyDTO> specialties) {
        this.specialties = specialties;
    }

    /**
     * @return the clinics
     */
    public Set<ClinicDTO> getClinics() {
        return clinics;
    }

    /**
     * @param clinics the clinics to set
     */
    public void setClinics(Set<ClinicDTO> clinics) {
        this.clinics = clinics;
    }

    /**
     * @return the userDTO
     */
    public UserDTO getUserDTO() {
        return userDTO;
    }

    /**
     * @param userDTO the userDTO to set
     */
    public void setUserDTO(UserDTO userDTO) {
        this.userDTO = userDTO;
    }
    
    
    
}