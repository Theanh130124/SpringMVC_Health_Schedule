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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "specialties")
@NamedQueries({
    @NamedQuery(name = "Specialties.findAll", query = "SELECT s FROM Specialties s"),
    @NamedQuery(name = "Specialties.findBySpecialtyId", query = "SELECT s FROM Specialties s WHERE s.specialtyId = :specialtyId"),
    @NamedQuery(name = "Specialties.findByName", query = "SELECT s FROM Specialties s WHERE s.name = :name")})
public class Specialties implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "specialty_id")
    private Integer specialtyId;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "name")
    private String name;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    private String description;
    @ManyToMany(mappedBy = "specialtiesSet")
    private Set<Doctors> doctorsSet;

    public Specialties() {
    }

    public Specialties(Integer specialtyId) {
        this.specialtyId = specialtyId;
    }

    public Specialties(Integer specialtyId, String name) {
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

    public Set<Doctors> getDoctorsSet() {
        return doctorsSet;
    }

    public void setDoctorsSet(Set<Doctors> doctorsSet) {
        this.doctorsSet = doctorsSet;
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
        if (!(object instanceof Specialties)) {
            return false;
        }
        Specialties other = (Specialties) object;
        if ((this.specialtyId == null && other.specialtyId != null) || (this.specialtyId != null && !this.specialtyId.equals(other.specialtyId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Specialties[ specialtyId=" + specialtyId + " ]";
    }
    
}
