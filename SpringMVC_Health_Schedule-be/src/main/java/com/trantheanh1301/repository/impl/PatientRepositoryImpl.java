/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.repository.PatientRepository;
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
public class PatientRepositoryImpl implements PatientRepository{
    @Autowired
    private LocalSessionFactoryBean factory;
    
    
    @Override
    public Patient register(Patient p) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(p);


        return p;
    }
    
}