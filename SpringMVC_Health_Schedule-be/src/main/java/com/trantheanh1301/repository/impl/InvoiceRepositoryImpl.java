/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Clinic;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.repository.InvoiceRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Asus
 */
@Repository
@Transactional
public class InvoiceRepositoryImpl implements InvoiceRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Invoice addInvoice(Invoice invoice) {

        Session s = this.factory.getObject().getCurrentSession();
        s.persist(invoice);
        s.refresh(invoice);
        return invoice;
    }
    
    @Override
    public Invoice getInvoiceById(int id){
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Invoice.findByInvoiceId", Invoice.class);
        q.setParameter("invoiceId", id);
        return (Invoice) q.getSingleResult();
    }

    @Override
    public Invoice updatePaymentStatusInvoice(Invoice invoice) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(invoice);
        s.refresh(invoice);
        return invoice;
    }

    @Override
    public Invoice getInvoiceByAppointmentId(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Invoice> query = b.createQuery(Invoice.class);
        Root<Invoice> root = query.from(Invoice.class);
        
        
        Predicate predicate = b.equal(root.get("appointmentId").get("appointmentId"), id);//Them dieu kien so sanh appointmentId cua invoice = id truyen vao
        query.select(root).where(predicate);
        
        Query q = s.createQuery(query);
        
        return (Invoice) q.getSingleResult();
    }
}
