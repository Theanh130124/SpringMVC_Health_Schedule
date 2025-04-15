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
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
import java.util.Set;

/**
 *
 * @author LAPTOP
 */
@Entity
@Table(name = "user", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"email"}),
    @UniqueConstraint(columnNames = {"phone_number"}),
    @UniqueConstraint(columnNames = {"username"})})
@NamedQueries({
    @NamedQuery(name = "User.findAll", query = "SELECT u FROM User u"),
    @NamedQuery(name = "User.findByUserId", query = "SELECT u FROM User u WHERE u.userId = :userId"),
    @NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email"),
    @NamedQuery(name = "User.findByUsername", query = "SELECT u FROM User u WHERE u.username = :username"),
    @NamedQuery(name = "User.findByPassword", query = "SELECT u FROM User u WHERE u.password = :password"),
    @NamedQuery(name = "User.findByFirstName", query = "SELECT u FROM User u WHERE u.firstName = :firstName"),
    @NamedQuery(name = "User.findByLastName", query = "SELECT u FROM User u WHERE u.lastName = :lastName"),
    @NamedQuery(name = "User.findByPhoneNumber", query = "SELECT u FROM User u WHERE u.phoneNumber = :phoneNumber"),
    @NamedQuery(name = "User.findByDateOfBirth", query = "SELECT u FROM User u WHERE u.dateOfBirth = :dateOfBirth"),
    @NamedQuery(name = "User.findByGender", query = "SELECT u FROM User u WHERE u.gender = :gender"),
    @NamedQuery(name = "User.findByRole", query = "SELECT u FROM User u WHERE u.role = :role"),
    @NamedQuery(name = "User.findByAvatar", query = "SELECT u FROM User u WHERE u.avatar = :avatar"),
    @NamedQuery(name = "User.findByIsActive", query = "SELECT u FROM User u WHERE u.isActive = :isActive"),
    @NamedQuery(name = "User.findByCreatedAt", query = "SELECT u FROM User u WHERE u.createdAt = :createdAt"),
    @NamedQuery(name = "User.findByUpdatedAt", query = "SELECT u FROM User u WHERE u.updatedAt = :updatedAt")})
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "email", nullable = false, length = 255)
    private String email;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "username", nullable = false, length = 100)
    private String username;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "address", nullable = false, length = 65535)
    private String address;
    @Column(name = "date_of_birth")
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;
    @Size(max = 6)
    @Column(name = "gender", length = 6)
    private String gender;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 7)
    @Column(name = "role", nullable = false, length = 7)
    private String role;
    @Size(max = 255)
    @Column(name = "avatar", length = 255)
    private String avatar;
    @Column(name = "is_active")
    private Boolean isActive;
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    @JsonIgnore
    @OneToMany(mappedBy = "userId")
    private Set<Healthrecord> healthrecordSet;
    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Doctor doctor;
    @JsonIgnore
    @OneToMany(mappedBy = "verifiedByAdminId")
    private Set<Doctorlicense> doctorlicenseSet;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Patient patient;

    public User() {
    }

    public User(Integer userId) {
        this.userId = userId;
    }

    public User(Integer userId, String email, String username, String password, String firstName, String lastName, String phoneNumber, String address, String role) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Set<Healthrecord> getHealthrecordSet() {
        return healthrecordSet;
    }

    public void setHealthrecordSet(Set<Healthrecord> healthrecordSet) {
        this.healthrecordSet = healthrecordSet;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Set<Doctorlicense> getDoctorlicenseSet() {
        return doctorlicenseSet;
    }

    public void setDoctorlicenseSet(Set<Doctorlicense> doctorlicenseSet) {
        this.doctorlicenseSet = doctorlicenseSet;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof User)) {
            return false;
        }
        User other = (User) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.trantheanh1301.pojo.User[ userId=" + userId + " ]";
    }
    
    @PrePersist
    protected void onCreate() {
        Timestamp now = Timestamp.from(Instant.now());
        this.createdAt = now;
        this.updatedAt = now;
        if (this.isActive == null) {
            this.isActive = true; // DEFAULT TRUE
        }
        if (this.avatar == null || this.avatar.isEmpty()) {
            // **ĐÂY LÀ NƠI BẠN XỬ LÝ DEFAULT CHO avatar**
            this.avatar = "https://res.cloudinary.com/dxiawzgnz/image/upload/v1744000840/qlrmknm7hfe81aplswy2.png";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Timestamp.from(Instant.now()); // Tự động cập nhật timestamp khi update
    }

}
