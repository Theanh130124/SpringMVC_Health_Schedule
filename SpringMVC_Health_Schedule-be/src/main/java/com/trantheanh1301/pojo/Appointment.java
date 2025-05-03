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
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "appointment")
@NamedQueries({
    @NamedQuery(name = "Appointment.findAll", query = "SELECT a FROM Appointment a"),
    @NamedQuery(name = "Appointment.findByAppointmentId", query = "SELECT a FROM Appointment a WHERE a.appointmentId = :appointmentId"),
    @NamedQuery(name = "Appointment.findByAppointmentTime", query = "SELECT a FROM Appointment a WHERE a.appointmentTime = :appointmentTime"),
    @NamedQuery(name = "Appointment.findByDurationMinutes", query = "SELECT a FROM Appointment a WHERE a.durationMinutes = :durationMinutes"),
    @NamedQuery(name = "Appointment.findByStatus", query = "SELECT a FROM Appointment a WHERE a.status = :status"),
    @NamedQuery(name = "Appointment.findByConsultationType", query = "SELECT a FROM Appointment a WHERE a.consultationType = :consultationType"),
    @NamedQuery(name = "Appointment.findByVideoCallLink", query = "SELECT a FROM Appointment a WHERE a.videoCallLink = :videoCallLink"),
    @NamedQuery(name = "Appointment.findByCreatedAt", query = "SELECT a FROM Appointment a WHERE a.createdAt = :createdAt"),
    @NamedQuery(name = "Appointment.findByUpdatedAt", query = "SELECT a FROM Appointment a WHERE a.updatedAt = :updatedAt")})
public class Appointment implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "appointment_id", nullable = false)
    private Integer appointmentId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "appointment_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date appointmentTime;
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    @Lob
    @Size(max = 65535)
    @Column(name = "reason", length = 65535)
    private String reason;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 18)
    @Column(name = "status", nullable = false, length = 18)
    private String status;
    @Size(max = 7)
    @Column(name = "consultation_type", length = 7)
    private String consultationType;
    @Size(max = 255)
    @Column(name = "video_call_link", length = 255)
    private String videoCallLink;
    @Lob
    @Size(max = 65535)
    @Column(name = "cancellation_reason", length = 65535)
    private String cancellationReason;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "appointmentId")
    private Set<Testresult> testresultSet;
    @JsonIgnore
    @OneToMany(mappedBy = "appointmentId")
    private Set<Healthrecord> healthrecordSet;


    @JoinColumn(name = "clinic_id", referencedColumnName = "clinic_id")
    @ManyToOne
    private Clinic clinicId;

    
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)
    @ManyToOne(optional = false)
    private Doctor doctorId;

   
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id", nullable = false)
    @ManyToOne(optional = false)
    private Patient patientId;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "appointmentId")
    private Review review;
    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "appointmentId")
    private Invoice invoice;



    public Appointment() {
    }

    public Appointment(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Appointment(Integer appointmentId, Date appointmentTime, String status) {
        this.appointmentId = appointmentId;
        this.appointmentTime = appointmentTime;
        this.status = status;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Date getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(Date appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConsultationType() {
        return consultationType;
    }

    public void setConsultationType(String consultationType) {
        this.consultationType = consultationType;
    }

    public String getVideoCallLink() {
        return videoCallLink;
    }

    public void setVideoCallLink(String videoCallLink) {
        this.videoCallLink = videoCallLink;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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

    public Clinic getClinicId() {
        return clinicId;
    }

    public void setClinicId(Clinic clinicId) {
        this.clinicId = clinicId;
    }

    public Doctor getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctor doctorId) {
        this.doctorId = doctorId;
    }

    public Patient getPatientId() {
        return patientId;
    }

    public void setPatientId(Patient patientId) {
        this.patientId = patientId;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (appointmentId != null ? appointmentId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Appointment)) {
            return false;
        }
        Appointment other = (Appointment) object;
        if ((this.appointmentId == null && other.appointmentId != null) || (this.appointmentId != null && !this.appointmentId.equals(other.appointmentId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Appointment[ appointmentId=" + appointmentId + " ]";
    }

    @PrePersist
    protected void onCreate() {
        Timestamp now = Timestamp.from(Instant.now());
        this.createdAt = now;
        this.updatedAt = now;
        // **ĐÂY LÀ NƠI XỬ LÝ DEFAULT CHO APPOINTMENT**
        if (this.durationMinutes == null) {
            this.durationMinutes = 30; // Default 30 phút
        }
        if (this.status == null) {
            this.status = "Scheduled"; // Default Scheduled
        }
        if (this.consultationType == null) {
            this.consultationType = "Offline"; // Default Offline
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Timestamp.from(Instant.now());
    }

}
