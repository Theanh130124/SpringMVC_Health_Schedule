/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.dto;

import java.util.Date;

/**
 *
 * @author thean
 */
public class ClinicDTO {
    private Integer clinicId;
    private String name;
    private String address;
    private String phoneNumber;
    private String website;
    private Date createdAt;
    private Date updatedAt;

    public ClinicDTO(Integer clinicId, String name, String address, String phoneNumber, String website, Date createdAt, Date updatedAt) {
        this.clinicId = clinicId;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.website = website;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public ClinicDTO() {
    }

    /**
     * @return the clinicId
     */
    public Integer getClinicId() {
        return clinicId;
    }

    /**
     * @param clinicId the clinicId to set
     */
    public void setClinicId(Integer clinicId) {
        this.clinicId = clinicId;
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
     * @return the address
     */
    public String getAddress() {
        return address;
    }

    /**
     * @param address the address to set
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * @return the phoneNumber
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * @param phoneNumber the phoneNumber to set
     */
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    /**
     * @return the website
     */
    public String getWebsite() {
        return website;
    }

    /**
     * @param website the website to set
     */
    public void setWebsite(String website) {
        this.website = website;
    }

    /**
     * @return the createdAt
     */
    public Date getCreatedAt() {
        return createdAt;
    }

    /**
     * @param createdAt the createdAt to set
     */
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * @return the updatedAt
     */
    public Date getUpdatedAt() {
        return updatedAt;
    }

    /**
     * @param updatedAt the updatedAt to set
     */
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    
}
