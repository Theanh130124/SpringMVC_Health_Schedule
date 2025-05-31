/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Payment;
import com.trantheanh1301.repository.PaymentRepository;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
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
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Payment addPayment(Payment payment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(payment);
        s.refresh(payment);
        return payment;
    }

    @Override
    public Payment updatePayment(Payment payment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(payment);
        s.refresh(payment);
        return payment;
    }

    @Override
    public Payment getPaymentById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Payment.findByPaymentId", Payment.class);
        q.setParameter("paymentId", id);
        return (Payment) q.getSingleResult();
    }

    @Override
    public Payment getPaymentByInvoiceId(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Payment> query = b.createQuery(Payment.class);
        Root<Payment> root = query.from(Payment.class);

        Predicate predicate = b.equal(root.get("invoiceId").get("invoiceId"), id);//Them dieu kien so sanh appointmentId cua invoice = id truyen vao
        query.select(root).where(predicate).orderBy(b.desc(root.get("paymentDate")));

        Query q = s.createQuery(query);

        try {
            q.setMaxResults(1);
            return (Payment) q.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public Payment getPaymentByTransactionId(String id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Payment> query = b.createQuery(Payment.class);
        Root<Payment> root = query.from(Payment.class);
        Predicate predicate = b.equal(root.get("transactionId"), id);//Them dieu kien so sanh 
        query.select(root).where(predicate);
        Query q = s.createQuery(query);
        List<Payment> results = q.getResultList();
        if (results.isEmpty()) {
            return null;
        }
        return results.get(0);
    }
}
