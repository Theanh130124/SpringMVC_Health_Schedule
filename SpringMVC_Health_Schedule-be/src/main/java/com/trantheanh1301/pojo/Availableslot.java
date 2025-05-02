/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import com.trantheanh1301.dto.DoctorDTO;
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
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "availableslot", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"doctor_id", "slot_date", "start_time", "end_time"})})
@NamedQueries({
    @NamedQuery(name = "Availableslot.findAll", query = "SELECT a FROM Availableslot a"),
    @NamedQuery(name = "Availableslot.findBySlotId", query = "SELECT a FROM Availableslot a WHERE a.slotId = :slotId"),
    @NamedQuery(name = "Availableslot.findBySlotDate", query = "SELECT a FROM Availableslot a WHERE a.slotDate = :slotDate"),
    @NamedQuery(name = "Availableslot.findByStartTime", query = "SELECT a FROM Availableslot a WHERE a.startTime = :startTime"),
    @NamedQuery(name = "Availableslot.findByEndTime", query = "SELECT a FROM Availableslot a WHERE a.endTime = :endTime"),
    @NamedQuery(name = "Availableslot.findByIsBooked", query = "SELECT a FROM Availableslot a WHERE a.isBooked = :isBooked"),
    @NamedQuery(name = "Availableslot.findByCreatedAt", query = "SELECT a FROM Availableslot a WHERE a.createdAt = :createdAt")})
public class Availableslot implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "slot_id", nullable = false)
    private Integer slotId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "slot_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date slotDate;
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
    @Column(name = "is_booked")
    private Boolean isBooked;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id", nullable = false)
    @ManyToOne(optional = false)
    private Doctor doctorId;
    
    
    
    
   

    public Availableslot() {
    }

    public Availableslot(Integer slotId) {
        this.slotId = slotId;
    }

    public Availableslot(Integer slotId, Date slotDate, Date startTime, Date endTime) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getSlotId() {
        return slotId;
    }

    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }

    public Date getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(Date slotDate) {
        this.slotDate = slotDate;
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

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
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
        hash += (slotId != null ? slotId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Availableslot)) {
            return false;
        }
        Availableslot other = (Availableslot) object;
        if ((this.slotId == null && other.slotId != null) || (this.slotId != null && !this.slotId.equals(other.slotId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Availableslot[ slotId=" + slotId + " ]";
    }
    
    
    
}
