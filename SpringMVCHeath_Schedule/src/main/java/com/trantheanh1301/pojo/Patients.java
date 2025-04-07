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
@Table(name = "patients")
@NamedQueries({
    @NamedQuery(name = "Patients.findAll", query = "SELECT p FROM Patients p"),
    @NamedQuery(name = "Patients.findByPatientId", query = "SELECT p FROM Patients p WHERE p.patientId = :patientId")})
public class Patients implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "patient_id")
    private Integer patientId;
    @Lob
    @Size(max = 65535)
    @Column(name = "medical_history_summary")
    private String medicalHistorySummary;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Appointments> appointmentsSet;
    @JoinColumn(name = "patient_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    @OneToOne(optional = false)
    private Users users;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Testresults> testresultsSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Healthrecords> healthrecordsSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "patientId")
    private Set<Reviews> reviewsSet;

    public Patients() {
    }

    public Patients(Integer patientId) {
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

    public Set<Appointments> getAppointmentsSet() {
        return appointmentsSet;
    }

    public void setAppointmentsSet(Set<Appointments> appointmentsSet) {
        this.appointmentsSet = appointmentsSet;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public Set<Testresults> getTestresultsSet() {
        return testresultsSet;
    }

    public void setTestresultsSet(Set<Testresults> testresultsSet) {
        this.testresultsSet = testresultsSet;
    }

    public Set<Healthrecords> getHealthrecordsSet() {
        return healthrecordsSet;
    }

    public void setHealthrecordsSet(Set<Healthrecords> healthrecordsSet) {
        this.healthrecordsSet = healthrecordsSet;
    }

    public Set<Reviews> getReviewsSet() {
        return reviewsSet;
    }

    public void setReviewsSet(Set<Reviews> reviewsSet) {
        this.reviewsSet = reviewsSet;
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
        if (!(object instanceof Patients)) {
            return false;
        }
        Patients other = (Patients) object;
        if ((this.patientId == null && other.patientId != null) || (this.patientId != null && !this.patientId.equals(other.patientId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Patients[ patientId=" + patientId + " ]";
    }
    
}
