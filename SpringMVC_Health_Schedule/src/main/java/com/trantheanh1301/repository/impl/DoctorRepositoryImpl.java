/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.repository.DoctorRepository;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author LAPTOP
 */
@Repository
@Transactional
public class DoctorRepositoryImpl implements DoctorRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Doctor register(Doctor d) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(d);

//khong co refesh
        return d;
    }

    @Override
    public Doctor getDoctorById(int doctorId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Doctor.findByDoctorId", Doctor.class);
        q.setParameter("doctorId",doctorId );
        return (Doctor) q.getSingleResult();
    }

//    @Override
//    public void deleteDoctorbyId(int doctorId) {
//        Session s = this.factory.getObject().getCurrentSession();
//        Doctor doctor = s.get(Doctor.class, doctorId);
//        if ( doctor != null){
//            s.remove(doctor);
//        }
//        
//        
//    }
    
    

}
