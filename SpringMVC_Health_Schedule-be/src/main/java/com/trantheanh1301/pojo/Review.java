/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "review", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"appointment_id"})})
@NamedQueries({
    @NamedQuery(name = "Review.findAll", query = "SELECT r FROM Review r"),
    @NamedQuery(name = "Review.findByReviewId", query = "SELECT r FROM Review r WHERE r.reviewId = :reviewId"),
    @NamedQuery(name = "Review.findByRating", query = "SELECT r FROM Review r WHERE r.rating = :rating"),
    @NamedQuery(name = "Review.findByReviewDate", query = "SELECT r FROM Review r WHERE r.reviewDate = :reviewDate"),
    @NamedQuery(name = "Review.findByResponseDate", query = "SELECT r FROM Review r WHERE r.responseDate = :responseDate"),
    @NamedQuery(name = "Review.findByIsVisible", query = "SELECT r FROM Review r WHERE r.isVisible = :isVisible")})
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "review_id", nullable = false)
    private Integer reviewId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "rating", nullable = false)
    private short rating;
    @Lob
    @Size(max = 65535)
    @Column(name = "comment", length = 65535)
    private String comment;
    @Column(name = "review_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reviewDate;
    @Lob
    @Size(max = 65535)
    @Column(name = "doctor_response", length = 65535)
    private String doctorResponse;
    @Column(name = "response_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date responseDate;
    @Column(name = "is_visible")
    private Boolean isVisible;
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id", nullable = false)
    @OneToOne(optional = false)
    @JsonIgnore
    private Appointment appointmentId;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)
    @ManyToOne(optional = false)
    @JsonIgnore
    private Doctor doctorId;
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id", nullable = false)
    @ManyToOne(optional = false)
    @JsonIgnore
    private Patient patientId;

    public Review() {
    }

    public Review(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Review(Integer reviewId, short rating) {
        this.reviewId = reviewId;
        this.rating = rating;
    }

    public Integer getReviewId() {
        return reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public short getRating() {
        return rating;
    }

    public void setRating(short rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(Date reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getDoctorResponse() {
        return doctorResponse;
    }

    public void setDoctorResponse(String doctorResponse) {
        this.doctorResponse = doctorResponse;
    }

    public Date getResponseDate() {
        return responseDate;
    }

    public void setResponseDate(Date responseDate) {
        this.responseDate = responseDate;
    }

    public Boolean getIsVisible() {
        return isVisible;
    }

    public void setIsVisible(Boolean isVisible) {
        this.isVisible = isVisible;
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

    public Patient getPatientId() {
        return patientId;
    }

    public void setPatientId(Patient patientId) {
        this.patientId = patientId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (reviewId != null ? reviewId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Review)) {
            return false;
        }
        Review other = (Review) object;
        if ((this.reviewId == null && other.reviewId != null) || (this.reviewId != null && !this.reviewId.equals(other.reviewId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Review[ reviewId=" + reviewId + " ]";
    }
    
    @PrePersist
    protected void onCreate() {
        // **ĐÂY LÀ NƠI XỬ LÝ DEFAULT CHO REVIEW**
        if (this.reviewDate == null) {
            this.reviewDate = Timestamp.from(Instant.now()); // Mặc định ngày review
        }
        if (this.isVisible == null) {
            this.isVisible = true; // Mặc định là hiển thị
        }
    }
    
}