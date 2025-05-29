/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.pojo.Review;
import com.trantheanh1301.repository.ReviewRepository;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.ws.rs.NotFoundException;
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
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;

    @Override
    public Review addReview(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(review); //Luu review
        s.refresh(review);
        return review;
    }

    @Override
    public Review updateResponseReview(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(review);
        s.refresh(review);
        return review;
    }

    @Override
    public Review getReviewById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("Review.findByReviewId", Review.class);
        q.setParameter("reviewId", id);
        
        try{
            return (Review) q.getSingleResult();
        }
        catch(NoResultException e){
            return null;    
        }
    }

    @Override
    public List<Review> getReviewListOfDoctor(int doctorId, Map<String, String> params) {

        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Review> q = b.createQuery(Review.class);
        Root<Review> root = q.from(Review.class);//Root la bang Review

        //Join bang doctor voi bang review
        Join<Review, Doctor> doctorJoin = root.join("doctorId");//join la bang Doctor

        Predicate predicate = b.equal(doctorJoin.get("doctorId"), doctorId);//Them dieu kien
        q.where(predicate).orderBy(b.desc(root.get("reviewDate")));
        Query query = s.createQuery(q);

        /*if (params != null) {
            String page = params.get("page");
            if (page != null && !page.isEmpty()) {
                int pageSize = Integer.parseInt(this.env.getProperty("PAGE_SIZE"));
                int p = Integer.parseInt(page);
                int start = (p - 1) * pageSize;
                query.setFirstResult(start);
                query.setMaxResults(pageSize);
            }
        }*/
        query.setFirstResult(0);
        query.setMaxResults(2);
        return query.getResultList();

    }

    @Override
    public List<Review> getReviewLists(Map<String, String> params) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Review> q = b.createQuery(Review.class);

        Root<Review> root = q.from(Review.class);
        q.orderBy(b.desc(root.get("rating")));
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

    @Override
    public Review getReviewByAppointmentId(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        CriteriaBuilder b = s.getCriteriaBuilder();
        CriteriaQuery<Review> q = b.createQuery(Review.class);

        Root<Review> root = q.from(Review.class);

        Predicate predicate = b.equal(root.get("appointmentId").get("appointmentId"), id);
        q.select(root).where(predicate);

        Query query = s.createQuery(q);
        
        try {
            return (Review) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
        
    }
}
