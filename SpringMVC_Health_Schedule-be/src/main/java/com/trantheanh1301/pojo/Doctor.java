
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "doctor")
@NamedQueries({
    @NamedQuery(name = "Doctor.findAll", query = "SELECT d FROM Doctor d"),
    @NamedQuery(name = "Doctor.findByDoctorId", query = "SELECT d FROM Doctor d WHERE d.doctorId = :doctorId"),
    @NamedQuery(name = "Doctor.findByYearsExperience", query = "SELECT d FROM Doctor d WHERE d.yearsExperience = :yearsExperience"),
    @NamedQuery(name = "Doctor.findByConsultationFee", query = "SELECT d FROM Doctor d WHERE d.consultationFee = :consultationFee"),
    @NamedQuery(name = "Doctor.findByAverageRating", query = "SELECT d FROM Doctor d WHERE d.averageRating = :averageRating")})
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "doctor_id", nullable = false)
    private Integer doctorId;
    @Column(name = "years_experience")
    private Integer yearsExperience;
    @Lob
    @Size(max = 65535)
    @Column(name = "bio", length = 65535)
    private String bio;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;
    @JoinTable(name = "doctor_specialty", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "specialty_id", referencedColumnName = "specialty_id", nullable = false)})
    @JsonIgnore
    @ManyToMany
    private Set<Specialty> specialtySet;
    @JoinTable(name = "doctor_clinic", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "clinic_id", referencedColumnName = "clinic_id", nullable = false)})
    
    
    @JsonIgnore
    @ManyToMany
    private Set<Clinic> clinicSet;
    
    
    @JsonIgnore
    @OneToMany(mappedBy = "doctorId")
    private Set<Testresult> testresultSet;
    
    
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Appointment> appointmentSet;
    
    
    @JoinColumn(name = "doctor_id", referencedColumnName = "user_id", nullable = false, insertable = false, updatable = false)
    
    @OneToOne(optional = false)
    private User user;
    
    
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Doctoravailability> doctoravailabilitySet;
    
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Doctorlicense> doctorlicenseSet;
    
    
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Review> reviewSet;

    public Doctor() {
    }

    public Doctor(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Set<Specialty> getSpecialtySet() {
        return specialtySet;
    }

    public void setSpecialtySet(Set<Specialty> specialtySet) {
        this.specialtySet = specialtySet;
    }

    public Set<Clinic> getClinicSet() {
        return clinicSet;
    }

    public void setClinicSet(Set<Clinic> clinicSet) {
        this.clinicSet = clinicSet;
    }

    public Set<Testresult> getTestresultSet() {
        return testresultSet;
    }

    public void setTestresultSet(Set<Testresult> testresultSet) {
        this.testresultSet = testresultSet;
    }

    public Set<Appointment> getAppointmentSet() {
        return appointmentSet;
    }

    public void setAppointmentSet(Set<Appointment> appointmentSet) {
        this.appointmentSet = appointmentSet;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Doctoravailability> getDoctoravailabilitySet() {
        return doctoravailabilitySet;
    }

    public void setDoctoravailabilitySet(Set<Doctoravailability> doctoravailabilitySet) {
        this.doctoravailabilitySet = doctoravailabilitySet;
    }

    public Set<Doctorlicense> getDoctorlicenseSet() {
        return doctorlicenseSet;
    }

    public void setDoctorlicenseSet(Set<Doctorlicense> doctorlicenseSet) {
        this.doctorlicenseSet = doctorlicenseSet;
    }

    public Set<Review> getReviewSet() {
        return reviewSet;
    }

    public void setReviewSet(Set<Review> reviewSet) {
        this.reviewSet = reviewSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (doctorId != null ? doctorId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Doctor)) {
            return false;
        }
        Doctor other = (Doctor) object;
        if ((this.doctorId == null && other.doctorId != null) || (this.doctorId != null && !this.doctorId.equals(other.doctorId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Doctor[ doctorId=" + doctorId + " ]";
    }
    @PrePersist
    protected void initializeDefaults() {
        // **ĐÂY LÀ NƠI XỬ LÝ DEFAULT CHO DOCTOR**
        if (this.yearsExperience == null) {
            this.yearsExperience = 0;
        }
        if (this.consultationFee == null) {
            this.consultationFee = BigDecimal.ZERO;
        }
         if (this.averageRating == null) {
            this.averageRating = BigDecimal.ZERO; // Rating ban đầu là 0
        }
        // bio có thể null
    }
    
}
