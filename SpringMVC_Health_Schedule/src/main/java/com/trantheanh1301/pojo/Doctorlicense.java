/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "doctorlicense")
@NamedQueries({
    @NamedQuery(name = "Doctorlicense.findAll", query = "SELECT d FROM Doctorlicense d"),
    @NamedQuery(name = "Doctorlicense.findByLicenseId", query = "SELECT d FROM Doctorlicense d WHERE d.licenseId = :licenseId"),
    @NamedQuery(name = "Doctorlicense.findByLicenseNumber", query = "SELECT d FROM Doctorlicense d WHERE d.licenseNumber = :licenseNumber"),
    @NamedQuery(name = "Doctorlicense.findByIssuingAuthority", query = "SELECT d FROM Doctorlicense d WHERE d.issuingAuthority = :issuingAuthority"),
    @NamedQuery(name = "Doctorlicense.findByIssueDate", query = "SELECT d FROM Doctorlicense d WHERE d.issueDate = :issueDate"),
    @NamedQuery(name = "Doctorlicense.findByExpiryDate", query = "SELECT d FROM Doctorlicense d WHERE d.expiryDate = :expiryDate"),
    @NamedQuery(name = "Doctorlicense.findByIsVerified", query = "SELECT d FROM Doctorlicense d WHERE d.isVerified = :isVerified"),
    @NamedQuery(name = "Doctorlicense.findByVerificationDate", query = "SELECT d FROM Doctorlicense d WHERE d.verificationDate = :verificationDate"),
    @NamedQuery(name = "Doctorlicense.findByCreatedAt", query = "SELECT d FROM Doctorlicense d WHERE d.createdAt = :createdAt"),
    @NamedQuery(name = "Doctorlicense.findByUpdatedAt", query = "SELECT d FROM Doctorlicense d WHERE d.updatedAt = :updatedAt")})
public class Doctorlicense implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "license_id")
    private Integer licenseId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "license_number")
    private String licenseNumber;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "issuing_authority")
    private String issuingAuthority;
    @Basic(optional = false)
    @NotNull
    @Column(name = "issue_date")
    @Temporal(TemporalType.DATE)
    private Date issueDate;
    @Column(name = "expiry_date")
    @Temporal(TemporalType.DATE)
    private Date expiryDate;
    @Lob
    @Size(max = 65535)
    @Column(name = "scope_description")
    private String scopeDescription;
    @Column(name = "is_verified")
    private Boolean isVerified;
    @Column(name = "verification_date")
    @Temporal(TemporalType.DATE)
    private Date verificationDate;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    @ManyToOne(optional = false)
    private Doctor doctorId;
    @JoinColumn(name = "verified_by_admin_id", referencedColumnName = "user_id")
    @ManyToOne
    private User verifiedByAdminId;

    public Doctorlicense() {
    }

    public Doctorlicense(Integer licenseId) {
        this.licenseId = licenseId;
    }

    public Doctorlicense(Integer licenseId, String licenseNumber, String issuingAuthority, Date issueDate) {
        this.licenseId = licenseId;
        this.licenseNumber = licenseNumber;
        this.issuingAuthority = issuingAuthority;
        this.issueDate = issueDate;
    }

    public Integer getLicenseId() {
        return licenseId;
    }

    public void setLicenseId(Integer licenseId) {
        this.licenseId = licenseId;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public Date getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getScopeDescription() {
        return scopeDescription;
    }

    public void setScopeDescription(String scopeDescription) {
        this.scopeDescription = scopeDescription;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Date getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(Date verificationDate) {
        this.verificationDate = verificationDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Doctor getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctor doctorId) {
        this.doctorId = doctorId;
    }

    public User getVerifiedByAdminId() {
        return verifiedByAdminId;
    }

    public void setVerifiedByAdminId(User verifiedByAdminId) {
        this.verifiedByAdminId = verifiedByAdminId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (licenseId != null ? licenseId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Doctorlicense)) {
            return false;
        }
        Doctorlicense other = (Doctorlicense) object;
        if ((this.licenseId == null && other.licenseId != null) || (this.licenseId != null && !this.licenseId.equals(other.licenseId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Doctorlicense[ licenseId=" + licenseId + " ]";
    }
    
}
