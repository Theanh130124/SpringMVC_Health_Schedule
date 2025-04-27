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

    
//Gom add với upadte thành 1
    
    @Override
    public Doctorlicense registerLicense(Doctorlicense license) {
        Session s = factory.getObject().getCurrentSession();
        s.persist(license);

//        s.refresh(license);  // refesh để khi tạo thì có thể hiện ra luôn
        return license;
    }

    
    //Truyền vào 1 đối tượng đã persistent rồi -> admin duyệt 
    @Override
    public Doctorlicense updateLicense(Doctorlicense license) {
        Session s = factory.getObject().getCurrentSession();
        s.merge(license);
        return license;

    }

    @Override
    public Doctorlicense getLicenseById(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Doctorlicense.class, id);
    }

    
    
    //Vì này truyền id nên cần lấy license ở trạng thái persistent
    @Override
    public void removeLicense(int id) {
        Session s = factory.getObject().getCurrentSession();
        Doctorlicense license = s.get(Doctorlicense.class, id);

        if (license != null) {
            s.remove(license);
        }
    }

}
