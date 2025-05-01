/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.dto;

import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.User;
import java.util.Date;

/**
 *
 * @author thean
 */
public class DoctorlicenseDTO {

    private Integer licenseId;
    private String licenseNumber;
    private String issuingAuthority;
    private Date issueDate;
    private Date expiryDate;
    private String scopeDescription;
    private Boolean isVerified;
    private Date createdAt;
    private Date updatedAt;
    private Doctor doctor;


    public DoctorlicenseDTO() {
    }

    public DoctorlicenseDTO(Integer licenseId, String licenseNumber, String issuingAuthority, Date issueDate, Date expiryDate, String scopeDescription, Boolean isVerified, Date createdAt, Date updatedAt, Doctor doctor) {
        this.licenseId = licenseId;
        this.licenseNumber = licenseNumber;
        this.issuingAuthority = issuingAuthority;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.scopeDescription = scopeDescription;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.doctor = doctor;

    }

    /**
     * @return the licenseId
     */
    public Integer getLicenseId() {
        return licenseId;
    }

    /**
     * @param licenseId the licenseId to set
     */
    public void setLicenseId(Integer licenseId) {
        this.licenseId = licenseId;
    }

    /**
     * @return the licenseNumber
     */
    public String getLicenseNumber() {
        return licenseNumber;
    }

    /**
     * @param licenseNumber the licenseNumber to set
     */
    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    /**
     * @return the issuingAuthority
     */
    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    /**
     * @param issuingAuthority the issuingAuthority to set
     */
    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    /**
     * @return the issueDate
     */
    public Date getIssueDate() {
        return issueDate;
    }

    /**
     * @param issueDate the issueDate to set
     */
    public void setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }

    /**
     * @return the expiryDate
     */
    public Date getExpiryDate() {
        return expiryDate;
    }

    /**
     * @param expiryDate the expiryDate to set
     */
    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    /**
     * @return the scopeDescription
     */
    public String getScopeDescription() {
        return scopeDescription;
    }

    /**
     * @param scopeDescription the scopeDescription to set
     */
    public void setScopeDescription(String scopeDescription) {
        this.scopeDescription = scopeDescription;
    }

    /**
     * @return the isVerified
     */
    public Boolean getIsVerified() {
        return isVerified;
    }

    /**
     * @param isVerified the isVerified to set
     */
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    /**
     * @return the verificationDate
     */
  

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

    /**
     * @return the doctor
     */
    public Doctor getDoctor() {
        return doctor;
    }

    /**
     * @param doctor the doctor to set
     */
    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    /**
     * @return the verifiedByAdmin
     */
   
    
    
}
