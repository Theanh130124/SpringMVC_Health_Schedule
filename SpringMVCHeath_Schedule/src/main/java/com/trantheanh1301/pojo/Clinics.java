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
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
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
@Table(name = "clinics")
@NamedQueries({
    @NamedQuery(name = "Clinics.findAll", query = "SELECT c FROM Clinics c"),
    @NamedQuery(name = "Clinics.findByClinicId", query = "SELECT c FROM Clinics c WHERE c.clinicId = :clinicId"),
    @NamedQuery(name = "Clinics.findByName", query = "SELECT c FROM Clinics c WHERE c.name = :name"),
    @NamedQuery(name = "Clinics.findByPhoneNumber", query = "SELECT c FROM Clinics c WHERE c.phoneNumber = :phoneNumber"),
    @NamedQuery(name = "Clinics.findByWebsite", query = "SELECT c FROM Clinics c WHERE c.website = :website"),
    @NamedQuery(name = "Clinics.findByCreatedAt", query = "SELECT c FROM Clinics c WHERE c.createdAt = :createdAt"),
    @NamedQuery(name = "Clinics.findByUpdatedAt", query = "SELECT c FROM Clinics c WHERE c.updatedAt = :updatedAt")})
public class Clinics implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "clinic_id")
    private Integer clinicId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 150)
    @Column(name = "name")
    private String name;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "address")
    private String address;
    @Size(max = 20)
    @Column(name = "phone_number")
    private String phoneNumber;
    @Size(max = 255)
    @Column(name = "website")
    private String website;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @ManyToMany(mappedBy = "clinicsSet")
    private Set<Doctors> doctorsSet;
    @OneToMany(mappedBy = "clinicId")
    private Set<Appointments> appointmentsSet;

    public Clinics() {
    }

    public Clinics(Integer clinicId) {
        this.clinicId = clinicId;
    }

    public Clinics(Integer clinicId, String name, String address) {
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

    public Set<Doctors> getDoctorsSet() {
        return doctorsSet;
    }

    public void setDoctorsSet(Set<Doctors> doctorsSet) {
        this.doctorsSet = doctorsSet;
    }

    public Set<Appointments> getAppointmentsSet() {
        return appointmentsSet;
    }

    public void setAppointmentsSet(Set<Appointments> appointmentsSet) {
        this.appointmentsSet = appointmentsSet;
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
        if (!(object instanceof Clinics)) {
            return false;
        }
        Clinics other = (Clinics) object;
        if ((this.clinicId == null && other.clinicId != null) || (this.clinicId != null && !this.clinicId.equals(other.clinicId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Clinics[ clinicId=" + clinicId + " ]";
    }
    
}
