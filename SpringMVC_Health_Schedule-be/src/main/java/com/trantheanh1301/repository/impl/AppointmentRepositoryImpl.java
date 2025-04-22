/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.repository.AppointmentRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public Appointment addOrUpdat(Appointment a) {
        Session s = factory.getObject().getCurrentSession();
        if (a.getAppointmentId() == null) {
            s.persist(a);
        } else {
            s.merge(a);
        }

        return a;
    }
    
    public Appointment getAppointmentById(int id){
        Session s = factory.getObject().getCurrentSession();
        return s.get(Appointment.class, id);
    }

}
