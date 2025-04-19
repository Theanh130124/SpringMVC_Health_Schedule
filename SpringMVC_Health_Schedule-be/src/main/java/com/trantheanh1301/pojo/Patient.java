/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "patient")
@NamedQueries({
    @NamedQuery(name = "Patient.findAll", query = "SELECT p FROM Patient p"),
    @NamedQuery(name = "Patient.findByPatientId", query = "SELECT p FROM Patient p WHERE p.patientId = :patientId")})
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "patient_id", nullable = false)
    private Integer patientId;
    @Lob
    @Size(max = 65535)
    @Column(name = "medical_history_summary", length = 65535)
    private String medicalHistorySummary;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Testresult> testresultSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Healthrecord> healthrecordSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Appointment> appointmentSet;
    @JoinColumn(name = "patient_id", referencedColumnName = "user_id", nullable = false, insertable = false, updatable = false)
    @OneToOne(optional = false)
    private User user;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Review> reviewSet;

    public Patient() {
    }

    public Patient(Integer patientId) {
        this.patientId = patientId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public String getMedicalHistorySummary() {
        return medicalHistorySummary;
    }

    public void setMedicalHistorySummary(String medicalHistorySummary) {
        this.medicalHistorySummary = medicalHistorySummary;
    }

    public Set<Testresult> getTestresultSet() {
        return testresultSet;
    }

    public void setTestresultSet(Set<Testresult> testresultSet) {
        this.testresultSet = testresultSet;
    }

    public Set<Healthrecord> getHealthrecordSet() {
        return healthrecordSet;
    }

    public void setHealthrecordSet(Set<Healthrecord> healthrecordSet) {
        this.healthrecordSet = healthrecordSet;
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

    public Set<Review> getReviewSet() {
        return reviewSet;
    }

    public void setReviewSet(Set<Review> reviewSet) {
        this.reviewSet = reviewSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (patientId != null ? patientId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Patient)) {
            return false;
        }
        Patient other = (Patient) object;
        if ((this.patientId == null && other.patientId != null) || (this.patientId != null && !this.patientId.equals(other.patientId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Patient[ patientId=" + patientId + " ]";
    }
    
}