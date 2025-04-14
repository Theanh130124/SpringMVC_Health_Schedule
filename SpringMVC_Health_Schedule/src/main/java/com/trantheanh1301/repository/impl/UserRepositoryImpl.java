/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.UserRepository;
import jakarta.persistence.Query;
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
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    //Dùng cho validate dữ liệu
    @Override
    public User getUserByUsername(String username) {
        Session s = factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByUsername", User.class);
        q.setParameter("username", username);

        List<User> results = q.getResultList();
        //để nó ra null để bên kia validate lại
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public User register(User u) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(u);

        s.flush();//insert liền để doctor , patient truy vấn
        s.refresh(u);
        return u;
    }

    //Dùng cho validate dữ liệu
    @Override
    public User getUserByEmail(String email) {
        Session s = factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByEmail", User.class);
        q.setParameter("email", email);
        List<User> results = q.getResultList();
        //để nó ra null để bên kia validate lại 
        return results.isEmpty() ? null : results.get(0);
    }

}
