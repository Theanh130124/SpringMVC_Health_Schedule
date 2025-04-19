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

    @Autowired
    private Environment env;

    //Tìm lịch bác sĩ rảnh 
    @Override
    public List<Doctoravailability> findAvailableTime(Map<String, String> params) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Doctoravailability> query = builder.createQuery(Doctoravailability.class);
        Root<Doctoravailability> rD = query.from(Doctoravailability.class);

        List<Predicate> predicates = new ArrayList<>();

        if (params != null) {
            if (params.containsKey("doctorId") && params.get("doctorId") != null) {
                int doctorId = Integer.parseInt(params.get("doctorId"));
                predicates.add(builder.equal(rD.get("doctorId"), doctorId));
            }

            if (params.containsKey("date") && params.get("date") != null) {
                LocalDate date = LocalDate.parse(params.get("date"));
                predicates.add(builder.equal(rD.get("dayOfWeek"), date.getDayOfWeek().toString()));
            }

            if (params.containsKey("startTime") && params.get("startTime") != null) {
                LocalTime startTime = LocalTime.parse(params.get("startTime"));
                predicates.add(builder.greaterThanOrEqualTo(rD.get("startTime"), startTime));
            }

            if (params.containsKey("endTime") && params.get("endTime") != null) {
                LocalTime endTime = LocalTime.parse(params.get("endTime"));
                predicates.add(builder.lessThanOrEqualTo(rD.get("endTime"), endTime));
            }

        }
        query.select(rD);
        // Mặc định chỉ lấy các khung giờ còn trống
        predicates.add(builder.isTrue(rD.get("isAvailable")));

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(Predicate[]::new));
        }

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
}
