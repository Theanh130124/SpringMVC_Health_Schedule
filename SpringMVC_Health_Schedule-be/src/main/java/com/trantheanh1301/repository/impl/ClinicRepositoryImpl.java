/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.repository.ClinicRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Session;
import org.hibernate.query.Query;
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
public class ClinicRepositoryImpl implements ClinicRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Clinic getClinicById(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Clinic.class, id);
    }

    @Override
    public Set<Clinic> getClinicAll() {
        Session s = factory.getObject().getCurrentSession();
        List<Clinic> clinics = s.createQuery("FROM Clinic", Clinic.class).getResultList();
        return new HashSet<>(clinics);
    }

    @Override
    public Clinic addOrUpdate(Clinic clinic) {
       Session s = factory.getObject().getCurrentSession();
       if (clinic.getClinicId() == null){
           s.persist(clinic);
       }else{
           
           s.merge(clinic);
       }
       return clinic;
       
    }

}