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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
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
@Table(name = "doctoravailability", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"doctor_id", "day_of_week", "start_time", "end_time"})})
@NamedQueries({
    @NamedQuery(name = "Doctoravailability.findAll", query = "SELECT d FROM Doctoravailability d"),
    @NamedQuery(name = "Doctoravailability.findByAvailabilityId", query = "SELECT d FROM Doctoravailability d WHERE d.availabilityId = :availabilityId"),
    @NamedQuery(name = "Doctoravailability.findByDayOfWeek", query = "SELECT d FROM Doctoravailability d WHERE d.dayOfWeek = :dayOfWeek"),
    @NamedQuery(name = "Doctoravailability.findByStartTime", query = "SELECT d FROM Doctoravailability d WHERE d.startTime = :startTime"),
    @NamedQuery(name = "Doctoravailability.findByEndTime", query = "SELECT d FROM Doctoravailability d WHERE d.endTime = :endTime"),
    @NamedQuery(name = "Doctoravailability.findByIsAvailable", query = "SELECT d FROM Doctoravailability d WHERE d.isAvailable = :isAvailable"),
    @NamedQuery(name = "Doctoravailability.findByCreatedAt", query = "SELECT d FROM Doctoravailability d WHERE d.createdAt = :createdAt")})
public class Doctoravailability implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "availability_id", nullable = false)
    private Integer availabilityId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 9)
    @Column(name = "day_of_week", nullable = false, length = 9)
    private String dayOfWeek;
    @Basic(optional = false)
    @NotNull
    @Column(name = "start_time", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date startTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "end_time", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date endTime;
    @Column(name = "is_available")
    private Boolean isAvailable;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)
    @ManyToOne(optional = false)
    private Doctor doctorId;

    public Doctoravailability() {
    }

    public Doctoravailability(Integer availabilityId) {
        this.availabilityId = availabilityId;
    }

    public Doctoravailability(Integer availabilityId, String dayOfWeek, Date startTime, Date endTime) {
        this.availabilityId = availabilityId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getAvailabilityId() {
        return availabilityId;
    }

    public void setAvailabilityId(Integer availabilityId) {
        this.availabilityId = availabilityId;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Doctor getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Doctor doctorId) {
        this.doctorId = doctorId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (availabilityId != null ? availabilityId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Doctoravailability)) {
            return false;
        }
        Doctoravailability other = (Doctoravailability) object;
        if ((this.availabilityId == null && other.availabilityId != null) || (this.availabilityId != null && !this.availabilityId.equals(other.availabilityId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Doctoravailability[ availabilityId=" + availabilityId + " ]";
    }
    @PrePersist
    protected void onCreate() {
        this.createdAt = Timestamp.from(Instant.now());
        if (this.isAvailable == null) {
             // **ĐÂY LÀ NƠI XỬ LÝ DEFAULT CHO isAvailable**
            this.isAvailable = true; // Mặc định là có sẵn
        }
    }
    
}