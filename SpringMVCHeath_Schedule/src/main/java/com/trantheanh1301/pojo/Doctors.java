/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "doctors")
@NamedQueries({
    @NamedQuery(name = "Doctors.findAll", query = "SELECT d FROM Doctors d"),
    @NamedQuery(name = "Doctors.findByDoctorId", query = "SELECT d FROM Doctors d WHERE d.doctorId = :doctorId"),
    @NamedQuery(name = "Doctors.findByYearsExperience", query = "SELECT d FROM Doctors d WHERE d.yearsExperience = :yearsExperience"),
    @NamedQuery(name = "Doctors.findByConsultationFee", query = "SELECT d FROM Doctors d WHERE d.consultationFee = :consultationFee"),
    @NamedQuery(name = "Doctors.findByAverageRating", query = "SELECT d FROM Doctors d WHERE d.averageRating = :averageRating")})
public class Doctors implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "doctor_id")
    private Integer doctorId;
    @Column(name = "years_experience")
    private Integer yearsExperience;
    @Lob
    @Size(max = 65535)
    @Column(name = "bio")
    private String bio;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "consultation_fee")
    private BigDecimal consultationFee;
    @Column(name = "average_rating")
    private BigDecimal averageRating;
    @JoinTable(name = "doctor_specialties", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")}, inverseJoinColumns = {
        @JoinColumn(name = "specialty_id", referencedColumnName = "specialty_id")})
    @ManyToMany
    private Set<Specialties> specialtiesSet;
    @JoinTable(name = "doctor_clinics", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")}, inverseJoinColumns = {
        @JoinColumn(name = "clinic_id", referencedColumnName = "clinic_id")})
    @ManyToMany
    private Set<Clinics> clinicsSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Appointments> appointmentsSet;
    @OneToMany(mappedBy = "doctorId")
    private Set<Testresults> testresultsSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Doctorlicenses> doctorlicensesSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Doctoravailability> doctoravailabilitySet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "doctorId")
    private Set<Reviews> reviewsSet;
    @JoinColumn(name = "doctor_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    @OneToOne(optional = false)
    private Users users;

    public Doctors() {
    }

    public Doctors(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Set<Specialties> getSpecialtiesSet() {
        return specialtiesSet;
    }

    public void setSpecialtiesSet(Set<Specialties> specialtiesSet) {
        this.specialtiesSet = specialtiesSet;
    }

    public Set<Clinics> getClinicsSet() {
        return clinicsSet;
    }

    public void setClinicsSet(Set<Clinics> clinicsSet) {
        this.clinicsSet = clinicsSet;
    }

    public Set<Appointments> getAppointmentsSet() {
        return appointmentsSet;
    }

    public void setAppointmentsSet(Set<Appointments> appointmentsSet) {
        this.appointmentsSet = appointmentsSet;
    }

    public Set<Testresults> getTestresultsSet() {
        return testresultsSet;
    }

    public void setTestresultsSet(Set<Testresults> testresultsSet) {
        this.testresultsSet = testresultsSet;
    }

    public Set<Doctorlicenses> getDoctorlicensesSet() {
        return doctorlicensesSet;
    }

    public void setDoctorlicensesSet(Set<Doctorlicenses> doctorlicensesSet) {
        this.doctorlicensesSet = doctorlicensesSet;
    }

    public Set<Doctoravailability> getDoctoravailabilitySet() {
        return doctoravailabilitySet;
    }

    public void setDoctoravailabilitySet(Set<Doctoravailability> doctoravailabilitySet) {
        this.doctoravailabilitySet = doctoravailabilitySet;
    }

    public Set<Reviews> getReviewsSet() {
        return reviewsSet;
    }

    public void setReviewsSet(Set<Reviews> reviewsSet) {
        this.reviewsSet = reviewsSet;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (doctorId != null ? doctorId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Doctors)) {
            return false;
        }
        Doctors other = (Doctors) object;
        if ((this.doctorId == null && other.doctorId != null) || (this.doctorId != null && !this.doctorId.equals(other.doctorId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.Doctors[ doctorId=" + doctorId + " ]";
    }
    
}
