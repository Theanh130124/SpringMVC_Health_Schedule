/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Specialty;
import com.trantheanh1301.repository.SpecialtyRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author thean
 */
@Repository
@Transactional
public class SpecialtyRepositoryImpl implements SpecialtyRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Specialty getSpecialtyById(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Specialty.class, id);
    }

    @Override
    public Set<Specialty> getAllSpecialty() {
        Session s = factory.getObject().getCurrentSession();
        List<Specialty> specialties = s.createQuery("FROM Specialty", Specialty.class).getResultList();
        return new HashSet<>(specialties);
    }

    @Override
    public Specialty addOrUpdate(Specialty s) {
        Session session = factory.getObject().getCurrentSession();
        if (s.getSpecialtyId() == null) {
            session.persist(s);
        } else {
            session.merge(s);
        }
        return s;
    }

}
