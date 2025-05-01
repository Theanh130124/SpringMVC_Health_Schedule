/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.dto;

/**
 *
 * @author thean
 */
public class SpecialtyDTO {
    private Integer specialtyId;
    private String name;
    private String description;

    public SpecialtyDTO() {
    }

    public SpecialtyDTO(Integer specialtyId, String name, String description) {
        this.specialtyId = specialtyId;
        this.name = name;
        this.description = description;
    }

    /**
     * @return the specialtyId
     */
    public Integer getSpecialtyId() {
        return specialtyId;
    }

    /**
     * @param specialtyId the specialtyId to set
     */
    public void setSpecialtyId(Integer specialtyId) {
        this.specialtyId = specialtyId;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }
    
    
    
}
