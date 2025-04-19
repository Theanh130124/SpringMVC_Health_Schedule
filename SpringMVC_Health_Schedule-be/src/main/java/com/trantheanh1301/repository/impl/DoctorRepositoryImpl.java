/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Specialty;
import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.DoctorRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import static org.hibernate.internal.util.StringHelper.root;
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
//Đọc config.properties
@PropertySource("classpath:configs.properties")
@Transactional
public class DoctorRepositoryImpl implements DoctorRepository {

    @Autowired
    private Environment env;

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Doctor register(Doctor d) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(d);

//khong co refesh
        return d;
    }

    @Override
    public Doctor getDoctorById(int doctorId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Doctor.findByDoctorId", Doctor.class);
        q.setParameter("doctorId", doctorId);
        return (Doctor) q.getSingleResult();
    }

//    @Override
//    public void deleteDoctorbyId(int doctorId) {
//        Session s = this.factory.getObject().getCurrentSession();
//        Doctor doctor = s.get(Doctor.class, doctorId);
//        if ( doctor != null){
//            s.remove(doctor);
//        }
//        
//        
//    }
    @Override
    public List<Doctor> getDoctor(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Doctor> query = builder.createQuery(Doctor.class);
        Root<Doctor> rD = query.from(Doctor.class);

        // Khai báo join ở đây để dùng khi cần -> tranh dư thừa
        Join<Doctor, User> userJoin = null;
        Join<Doctor, Specialty> specialtyJoin = null;
        Join<Doctor, Clinic> clinicJoin = null;

        List<Predicate> predicates = new ArrayList<>();
        if (params != null) {
            String doctorName = params.get("doctorName");
            String specialtyName = params.get("specialtyName");
            String clinicName = params.get("clinicName");
            //Khi có truyền doctorName thì phép join này mới đc bật
            if (doctorName != null && !doctorName.trim().isEmpty()) {
                if (userJoin == null) {
                    userJoin = rD.join("user", JoinType.LEFT);
                }

                predicates.add(builder.or(
                        builder.like(builder.lower(userJoin.get("firstName")), "%" + doctorName.toLowerCase() + "%"),
                        builder.like(builder.lower(userJoin.get("lastName")), "%" + doctorName.toLowerCase() + "%")
                ));
            }

            if (specialtyName != null && !specialtyName.trim().isEmpty()) {
                if (specialtyJoin == null) {
                    specialtyJoin = rD.join("specialtySet", JoinType.LEFT);
                }

                predicates.add(builder.like(
                        builder.lower(specialtyJoin.get("name")),
                        "%" + specialtyName.toLowerCase() + "%"
                ));
            }

            if (clinicName != null && !clinicName.trim().isEmpty()) {
                if (clinicJoin == null) {
                    clinicJoin = rD.join("clinicSet", JoinType.LEFT);
                }

                predicates.add(builder.like(
                        builder.lower(clinicJoin.get("name")),
                        "%" + clinicName.toLowerCase() + "%"
                ));
            }
        }

        query.select(rD).distinct(true);
        //Nếu không có predicate thì sẽ lọc hết doctor 
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
