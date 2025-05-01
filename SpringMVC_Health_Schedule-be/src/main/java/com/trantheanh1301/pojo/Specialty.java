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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "specialty", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"name"})})
@NamedQueries({
    @NamedQuery(name = "Specialty.findAll", query = "SELECT s FROM Specialty s"),
    @NamedQuery(name = "Specialty.findBySpecialtyId", query = "SELECT s FROM Specialty s WHERE s.specialtyId = :specialtyId"),
    @NamedQuery(name = "Specialty.findByName", query = "SELECT s FROM Specialty s WHERE s.name = :name")})
public class Specialty implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "specialty_id", nullable = false)
    private Integer specialtyId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "description", length = 65535)
    private String description;
    
    

    
    @ManyToMany(mappedBy = "specialtySet")
    private Set<Doctor> doctorSet;

    public Specialty() {
    }

    public Specialty(Integer specialtyId) {
        this.specialtyId = specialtyId;
    }

    public Specialty(Integer specialtyId, String name) {
        this.specialtyId = specialtyId;
        this.name = name;
    }

    public Integer getSpecialtyId() {
        return specialtyId;
    }

    public void setSpecialtyId(Integer specialtyId) {
        this.specialtyId = specialtyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Doctor> getDoctorSet() {
        return doctorSet;
    }

    public void setDoctorSet(Set<Doctor> doctorSet) {
        this.doctorSet = doctorSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (specialtyId != null ? specialtyId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Specialty)) {
            return false;
        }
        Specialty other = (Specialty) object;
        if ((this.specialtyId == null && other.specialtyId != null) || (this.specialtyId != null && !this.specialtyId.equals(other.specialtyId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Specialty[ specialtyId=" + specialtyId + " ]";
    }
    
}