/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
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
@Table(name = "clinic")
@NamedQueries({
    @NamedQuery(name = "Clinic.findAll", query = "SELECT c FROM Clinic c"),
    @NamedQuery(name = "Clinic.findByClinicId", query = "SELECT c FROM Clinic c WHERE c.clinicId = :clinicId"),
    @NamedQuery(name = "Clinic.findByName", query = "SELECT c FROM Clinic c WHERE c.name = :name"),
    @NamedQuery(name = "Clinic.findByPhoneNumber", query = "SELECT c FROM Clinic c WHERE c.phoneNumber = :phoneNumber"),
    @NamedQuery(name = "Clinic.findByWebsite", query = "SELECT c FROM Clinic c WHERE c.website = :website"),
    @NamedQuery(name = "Clinic.findByCreatedAt", query = "SELECT c FROM Clinic c WHERE c.createdAt = :createdAt"),
    @NamedQuery(name = "Clinic.findByUpdatedAt", query = "SELECT c FROM Clinic c WHERE c.updatedAt = :updatedAt")})
public class Clinic implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "clinic_id", nullable = false)
    private Integer clinicId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 150)
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "address", nullable = false, length = 65535)
    private String address;
    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Size(max = 255)
    @Column(name = "website", length = 255)
    private String website;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    
    

    @ManyToMany(mappedBy = "clinicSet")
    private Set<Doctor> doctorSet;
    
    
    @JsonIgnore
    @OneToMany(mappedBy = "clinicId")
    private Set<Appointment> appointmentSet;

    public Clinic() {
    }

    public Clinic(Integer clinicId) {
        this.clinicId = clinicId;
    }

    public Clinic(Integer clinicId, String name, String address) {
        this.clinicId = clinicId;
        this.name = name;
        this.address = address;
    }

    public Integer getClinicId() {
        return clinicId;
    }

    public void setClinicId(Integer clinicId) {
        this.clinicId = clinicId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
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

    public Set<Doctor> getDoctorSet() {
        return doctorSet;
    }

    public void setDoctorSet(Set<Doctor> doctorSet) {
        this.doctorSet = doctorSet;
    }

    public Set<Appointment> getAppointmentSet() {
        return appointmentSet;
    }

    public void setAppointmentSet(Set<Appointment> appointmentSet) {
        this.appointmentSet = appointmentSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (clinicId != null ? clinicId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Clinic)) {
            return false;
        }
        Clinic other = (Clinic) object;
        if ((this.clinicId == null && other.clinicId != null) || (this.clinicId != null && !this.clinicId.equals(other.clinicId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Clinic[ clinicId=" + clinicId + " ]";
    }
    @PrePersist
    protected void onCreate() {
        Timestamp now = Timestamp.from(Instant.now());
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Timestamp.from(Instant.now());
    }
    
}