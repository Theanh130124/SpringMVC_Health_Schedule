/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.repository.InvoiceRepository;
import jakarta.persistence.Query;
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
}
