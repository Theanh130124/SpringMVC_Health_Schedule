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
import jakarta.persistence.OneToOne;
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
@Table(name = "reviews")
@NamedQueries({
    @NamedQuery(name = "Reviews.findAll", query = "SELECT r FROM Reviews r"),
    @NamedQuery(name = "Reviews.findByReviewId", query = "SELECT r FROM Reviews r WHERE r.reviewId = :reviewId"),
    @NamedQuery(name = "Reviews.findByRating", query = "SELECT r FROM Reviews r WHERE r.rating = :rating"),
    @NamedQuery(name = "Reviews.findByReviewDate", query = "SELECT r FROM Reviews r WHERE r.reviewDate = :reviewDate"),
    @NamedQuery(name = "Reviews.findByResponseDate", query = "SELECT r FROM Reviews r WHERE r.responseDate = :responseDate"),
    @NamedQuery(name = "Reviews.findByIsVisible", query = "SELECT r FROM Reviews r WHERE r.isVisible = :isVisible")})
public class Reviews implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "review_id")
    private Integer reviewId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "rating")
    private short rating;
    @Lob
    @Size(max = 65535)
    @Column(name = "comment")
    private String comment;
    @Column(name = "review_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reviewDate;
    @Lob
    @Size(max = 65535)
    @Column(name = "doctor_response")
    private String doctorResponse;
    @Column(name = "response_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date responseDate;
    @Column(name = "is_visible")
    private Boolean isVisible;
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    @OneToOne(optional = false)
    private Appointments appointmentId;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    @ManyToOne(optional = false)
    private Doctors doctorId;
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    @ManyToOne(optional = false)
    private Patients patientId;

    public Reviews() {
    }

    public Reviews(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Reviews(Integer reviewId, short rating) {
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

    public Appointments getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Appointments appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Doctors getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctors doctorId) {
        this.doctorId = doctorId;
    }

    public Patients getPatientId() {
        return patientId;
    }

    public void setPatientId(Patients patientId) {
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
        if (!(object instanceof Reviews)) {
            return false;
        }
        Reviews other = (Reviews) object;
        if ((this.reviewId == null && other.reviewId != null) || (this.reviewId != null && !this.reviewId.equals(other.reviewId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Reviews[ reviewId=" + reviewId + " ]";
    }
    
}
