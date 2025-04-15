/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Doctorlicense;
import com.trantheanh1301.repository.DoctorLicenseRepository;
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
public class DoctorLicenseRepositoryImpl implements DoctorLicenseRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Doctorlicense register_license(Doctorlicense license) {
        Session s = factory.getObject().getCurrentSession();
        s.persist(license);

//        s.refresh(license);  // refesh để khi tạo thì có thể hiện ra luôn

        return license;
    }

}
