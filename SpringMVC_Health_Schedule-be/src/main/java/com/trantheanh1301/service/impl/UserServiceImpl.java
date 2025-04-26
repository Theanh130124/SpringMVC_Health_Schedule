/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
import com.trantheanh1301.repository.UserRepository;
import com.trantheanh1301.service.UserService;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author LAPTOP
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private PatientRepository patientRepo;

    @Autowired
    private BCryptPasswordEncoder passswordEncoder;

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username!");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(u.getRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }

    //Đăng ký cho cả 3 role
    @Override
    public User register(Map<String, String> params, MultipartFile avatar) {

        String username = params.get("username");
        String email = params.get("email");
        if (this.userRepo.getUserByUsername(username) != null || username.isEmpty()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (this.userRepo.getUserByEmail(email) != null || email.isEmpty()) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        User u = new User();
        u.setFirstName(params.get("firstName"));
        u.setLastName(params.get("lastName"));
        //unique
        u.setUsername(username);
        //unique
        u.setEmail(email);
        //unique
        u.setPhoneNumber(params.get("phone"));
        u.setPassword(this.passswordEncoder.encode(params.get("password")));
        u.setAddress(params.get("address"));
        u.setGender(params.get("gender"));
        u.setDateOfBirth(DateFormatter.parseDate(params.get("birthday")));

        if (!avatar.isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(avatar.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));
                u.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                Logger.getLogger(UserServiceImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        String role = params.get("role");
        u.setRole(role);
        //Lưu user
        this.userRepo.register(u);

        if (role.equals("Doctor")) {
            Doctor doctor = new Doctor();
            doctor.setDoctorId(u.getUserId());
            doctor.setYearsExperience(Integer.parseInt(params.get("yearsExperience")));
            doctor.setBio(params.get("bio"));
            doctor.setConsultationFee(new BigDecimal(params.get("consultationFee")));
            doctor.setAverageRating(new BigDecimal(params.get("averageRating")));
            Doctor saveDoctor = this.doctorRepo.register(doctor); // Lưa bảng doctor
            //Riêng bác sĩ sẽ khóa lại để cung cấp chứng chỉ hành nghề admin duyệt
            u.setIsActive(Boolean.FALSE);
            u.setDoctor(saveDoctor);

        }
        if (role.equals("Patient")) {
            Patient patient = new Patient();
            patient.setPatientId(u.getUserId());
            patient.setMedicalHistorySummary(params.get("medicalHistory"));
            Patient savedPatient = this.patientRepo.register(patient); // Lưu vào bảng Patient
            u.setPatient(savedPatient);  //Cho no tra ra ca thong tin nay

        }

        return u;
    }

    @Override
    public boolean authenticate(String username, String password) {
        return this.userRepo.authenticated(username, password);
    }

}
