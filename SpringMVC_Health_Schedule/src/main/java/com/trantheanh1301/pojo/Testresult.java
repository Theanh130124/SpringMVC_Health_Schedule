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
@Table(name = "testresult")
@NamedQueries({
    @NamedQuery(name = "Testresult.findAll", query = "SELECT t FROM Testresult t"),
    @NamedQuery(name = "Testresult.findByResultId", query = "SELECT t FROM Testresult t WHERE t.resultId = :resultId"),
    @NamedQuery(name = "Testresult.findByTestName", query = "SELECT t FROM Testresult t WHERE t.testName = :testName"),
    @NamedQuery(name = "Testresult.findByResultValue", query = "SELECT t FROM Testresult t WHERE t.resultValue = :resultValue"),
    @NamedQuery(name = "Testresult.findByResultUnit", query = "SELECT t FROM Testresult t WHERE t.resultUnit = :resultUnit"),
    @NamedQuery(name = "Testresult.findByResultDate", query = "SELECT t FROM Testresult t WHERE t.resultDate = :resultDate"),
    @NamedQuery(name = "Testresult.findByAttachmentUrl", query = "SELECT t FROM Testresult t WHERE t.attachmentUrl = :attachmentUrl"),
    @NamedQuery(name = "Testresult.findByCreatedAt", query = "SELECT t FROM Testresult t WHERE t.createdAt = :createdAt"),
    @NamedQuery(name = "Testresult.findByUpdatedAt", query = "SELECT t FROM Testresult t WHERE t.updatedAt = :updatedAt")})
public class Testresult implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "result_id")
    private Integer resultId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 150)
    @Column(name = "test_name")
    private String testName;
    @Size(max = 100)
    @Column(name = "result_value")
    private String resultValue;
    @Size(max = 50)
    @Column(name = "result_unit")
    private String resultUnit;
    @Basic(optional = false)
    @NotNull
    @Column(name = "result_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date resultDate;
    @Lob
    @Size(max = 65535)
    @Column(name = "notes")
    private String notes;
    @Size(max = 255)
    @Column(name = "attachment_url")
    private String attachmentUrl;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    @ManyToOne
    private Appointment appointmentId;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    @ManyToOne
    private Doctor doctorId;
    @JoinColumn(name = "health_record_id", referencedColumnName = "record_id")
    @ManyToOne
    private Healthrecord healthRecordId;
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    @ManyToOne(optional = false)
    private Patient patientId;

    public Testresult() {
    }

    public Testresult(Integer resultId) {
        this.resultId = resultId;
    }

    public Testresult(Integer resultId, String testName, Date resultDate) {
        this.resultId = resultId;
        this.testName = testName;
        this.resultDate = resultDate;
    }

    public Integer getResultId() {
        return resultId;
    }

    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getResultValue() {
        return resultValue;
    }

    public void setResultValue(String resultValue) {
        this.resultValue = resultValue;
    }

    public String getResultUnit() {
        return resultUnit;
    }

    public void setResultUnit(String resultUnit) {
        this.resultUnit = resultUnit;
    }

    public Date getResultDate() {
        return resultDate;
    }

    public void setResultDate(Date resultDate) {
        this.resultDate = resultDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
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

    public Appointment getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Appointment appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Doctor getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctor doctorId) {
        this.doctorId = doctorId;
    }

    public Healthrecord getHealthRecordId() {
        return healthRecordId;
    }

    public void setHealthRecordId(Healthrecord healthRecordId) {
        this.healthRecordId = healthRecordId;
    }

    public Patient getPatientId() {
        return patientId;
    }

    public void setPatientId(Patient patientId) {
        this.patientId = patientId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (resultId != null ? resultId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Testresult)) {
            return false;
        }
        Testresult other = (Testresult) object;
        if ((this.resultId == null && other.resultId != null) || (this.resultId != null && !this.resultId.equals(other.resultId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Testresult[ resultId=" + resultId + " ]";
    }
    
}
