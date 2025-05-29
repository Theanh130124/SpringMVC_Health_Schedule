/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Doctorlicense;
import com.trantheanh1301.repository.DoctorLicenseRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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

    @Autowired
    private Environment env;

//Gom add với upadte thành 1
    //Load để duyệt
    @Override
    public List<Doctorlicense> loadLicense(Map<String, String> params) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Doctorlicense> query = builder.createQuery(Doctorlicense.class);

        Root<Doctorlicense> rD = query.from(Doctorlicense.class);
        List<Predicate> predicates = new ArrayList<>();

        predicates.add(builder.equal(rD.get("isVerified"), Boolean.FALSE));

        query.select(rD);

        query.where(predicates.toArray(Predicate[]::new));
        Query q = s.createQuery(query);

        if (params != null) {

            String page = params.get("page");
            if (page != null && !page.isEmpty()) {
                int pageSize = Integer.parseInt(this.env.getProperty("PAGE_SIZE"));
                int p = Integer.parseInt(page);
                int start = (p - 1) * pageSize;

                q.setFirstResult(start);
                q.setMaxResults(pageSize);

            }

        }

        return q.getResultList();
    }

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
        s.flush(); // ép từ session xuống csdl luôn , (không cần giao tác)
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
            s.flush();
        }
    }

}
