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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "healthrecords")
@NamedQueries({
    @NamedQuery(name = "Healthrecords.findAll", query = "SELECT h FROM Healthrecords h"),
    @NamedQuery(name = "Healthrecords.findByRecordId", query = "SELECT h FROM Healthrecords h WHERE h.recordId = :recordId"),
    @NamedQuery(name = "Healthrecords.findByRecordDate", query = "SELECT h FROM Healthrecords h WHERE h.recordDate = :recordDate"),
    @NamedQuery(name = "Healthrecords.findByCreatedAt", query = "SELECT h FROM Healthrecords h WHERE h.createdAt = :createdAt"),
    @NamedQuery(name = "Healthrecords.findByUpdatedAt", query = "SELECT h FROM Healthrecords h WHERE h.updatedAt = :updatedAt")})
public class Healthrecords implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "record_id")
    private Integer recordId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "record_date")
    @Temporal(TemporalType.DATE)
    private Date recordDate;
    @Lob
    @Size(max = 65535)
    @Column(name = "symptoms")
    private String symptoms;
    @Lob
    @Size(max = 65535)
    @Column(name = "diagnosis")
    private String diagnosis;
    @Lob
    @Size(max = 65535)
    @Column(name = "prescription")
    private String prescription;
    @Lob
    @Size(max = 65535)
    @Column(name = "notes")
    private String notes;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @OneToMany(mappedBy = "healthRecordId")
    private Set<Testresults> testresultsSet;
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    @ManyToOne
    private Appointments appointmentId;
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    @ManyToOne(optional = false)
    private Patients patientId;
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    @ManyToOne
    private Users userId;

    public Healthrecords() {
    }

    public Healthrecords(Integer recordId) {
        this.recordId = recordId;
    }

    public Healthrecords(Integer recordId, Date recordDate) {
        this.recordId = recordId;
        this.recordDate = recordDate;
    }

    public Integer getRecordId() {
        return recordId;
    }

    public void setRecordId(Integer recordId) {
        this.recordId = recordId;
    }

    public Date getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public Set<Testresults> getTestresultsSet() {
        return testresultsSet;
    }

    public void setTestresultsSet(Set<Testresults> testresultsSet) {
        this.testresultsSet = testresultsSet;
    }

    public Appointments getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Appointments appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Patients getPatientId() {
        return patientId;
    }

    public void setPatientId(Patients patientId) {
        this.patientId = patientId;
    }

    public Users getUserId() {
        return userId;
    }

    public void setUserId(Users userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (recordId != null ? recordId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Healthrecords)) {
            return false;
        }
        Healthrecords other = (Healthrecords) object;
        if ((this.recordId == null && other.recordId != null) || (this.recordId != null && !this.recordId.equals(other.recordId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Healthrecords[ recordId=" + recordId + " ]";
    }
    
}
