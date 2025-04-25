/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.repository.PaymentRepository;
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
public class PaymentRepositoryImpl implements PaymentRepository{

    @Autowired
    private LocalSessionFactoryBean factory;
    
    @Override
    public Payment addPayment(Payment payment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(payment);
        s.refresh(payment);
        return payment;
    }
    
}
