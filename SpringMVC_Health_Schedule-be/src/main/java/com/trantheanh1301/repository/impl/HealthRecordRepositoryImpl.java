
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.repository.HealthRecordRepository;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Asus
 */
@Repository
@Transactional
public class HealthRecordRepositoryImpl implements HealthRecordRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Healthrecord addHealthRecord(Healthrecord healthRecord) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(healthRecord);
        s.refresh(healthRecord);
        return healthRecord;
    }

    @Override
    public Healthrecord getHealthRecordById(int id) {
         Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Healthrecord.findByRecordId", Healthrecord.class);
        q.setParameter("recordId", id);
        return (Healthrecord) q.getSingleResult();
    }

    @Override
    public Healthrecord updateHealthRecord(Healthrecord healthrecord) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(healthrecord);
        s.refresh(healthrecord);
        return healthrecord;
    }

}

