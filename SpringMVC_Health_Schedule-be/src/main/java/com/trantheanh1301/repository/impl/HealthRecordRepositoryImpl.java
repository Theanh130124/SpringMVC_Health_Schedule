
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;


import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.repository.HealthRecordRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
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
 * @author Asus
 */
@Repository
@Transactional
public class HealthRecordRepositoryImpl implements HealthRecordRepository {

    @Autowired
    private Environment env;

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

    @Override
    public List<Healthrecord> getHealthRecordListByUserId(int id, Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Healthrecord> q = b.createQuery(Healthrecord.class);
        Root<Healthrecord> root = q.from(Healthrecord.class);

        Predicate predicate = b.equal(root.get("userId").get("userId"), id);
        q.where(predicate);

        Query query = s.createQuery(q);

        if (params != null) {
            String page = params.get("page");
            if (page != null && !page.isEmpty()) {
                int pageSize = Integer.parseInt(this.env.getProperty("PAGE_SIZE"));
                int p = Integer.parseInt(page);
                int start = (p - 1) * pageSize;
                query.setFirstResult(start);
                query.setMaxResults(pageSize);
            }
        }
        return query.getResultList();
    }

}
