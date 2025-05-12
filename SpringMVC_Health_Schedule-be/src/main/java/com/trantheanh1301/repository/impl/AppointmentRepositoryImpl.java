/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Patient;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.DoctorRepository;
import com.trantheanh1301.repository.PatientRepository;
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
//Dùng đăng ký lịch khám -> nhớ check lại với lịch trống bác sĩ để đồng bộ
@Repository
@Transactional
public class AppointmentRepositoryImpl implements AppointmentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private PatientRepository patientRepo;

    //Xem lịch khám theo userId (có thể là bác sĩ hoặc bệnh nhân đều xem 1 lịch đó)
    @Override
    public List<Appointment> getListAppointment(Map<String, String> params) {

        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Appointment> query = builder.createQuery(Appointment.class);

        Root<Appointment> rA = query.from(Appointment.class);

        List<Predicate> predicates = new ArrayList<>();

        if (params != null) {
            //Lọc theo bác sĩ hoặc của bệnh nhân

            if (params.containsKey("doctorId") && params.get("doctorId") != null) {
                Integer doctorId = Integer.valueOf(params.get("doctorId"));
                Doctor doctor = doctorRepo.getDoctorById(doctorId);
                predicates.add(builder.equal(rA.get("doctorId"), doctor));
            }

            if (params.containsKey("patientId") && params.get("patientId") != null) {
                Integer patientId = Integer.valueOf(params.get("patientId"));
                Patient patient = patientRepo.getPatientbyId(patientId);
                predicates.add(builder.equal(rA.get("patientId"), patient));
            }

            query.select(rA);
            
            
            

            //Truyền 1 params doctorId hoặc 1 patientId thôi
            query.select(rA).where(builder.or(predicates.toArray(Predicate[]::new)));

            
            
            query.orderBy(builder.desc(rA.get("appointmentTime")));
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

    @Override
    public Appointment addOrUpdate(Appointment a) {
        Session s = factory.getObject().getCurrentSession();
        if (a.getAppointmentId() == null) {
            s.persist(a);
        } else {
            s.merge(a);
        }

        return a;
    }

    public Appointment getAppointmentById(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(Appointment.class, id);
    }

    @Override
    public void delete(Appointment a) {
        Session s = factory.getObject().getCurrentSession();
        s.remove(a);
                   
    }
    
    

}
