/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Doctoravailability;
import com.trantheanh1301.repository.DoctorAvailabilityRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author LAPTOP
 */
@Repository
@PropertySource("classpath:configs.properties")
@Transactional
public class DoctorAvailabilityRepositoryImpl implements DoctorAvailabilityRepository {
    
    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public Doctoravailability addOrUpdate(Doctoravailability dvt) {
        Session s = factory.getObject().getCurrentSession();
        if (dvt.getAvailabilityId() == null) {
            s.persist(dvt);
        } else {
            s.merge(dvt);
        }
        
        return dvt;
        
    }
    
    @Override
    public Doctoravailability findDoctorAvailabilityById(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Doctoravailability.class, id);
    }
    
    @Override
    public List<Doctoravailability> listAvailability(int doctorId) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Doctoravailability> query = builder.createQuery(Doctoravailability.class);
        Root<Doctoravailability> rD = query.from(Doctoravailability.class);
        
        Predicate predicate = builder.equal(rD.get("doctorId").as(Integer.class), doctorId);
        
        query.select(rD).where(predicate);
        return s.createQuery(query).getResultList();
    }
    
    @Override
    public void deleteAvailability(Doctoravailability dvt) {
        Session s = factory.getObject().getCurrentSession();
        s.remove(dvt);
    }
    
}
