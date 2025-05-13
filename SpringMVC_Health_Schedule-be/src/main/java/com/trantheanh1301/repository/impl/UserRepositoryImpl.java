/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.pojo.User;
import com.trantheanh1301.repository.UserRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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

    //Dùng cho validate dữ liệu+
    @Override
    public User getUserByEmail(String email) {
        Session s = factory.getObject().getCurrentSession();
        Query q = s.createNamedQuery("User.findByEmail", User.class);
        q.setParameter("email", email);
        List<User> results = q.getResultList();
        //để nó ra null để bên kia validate lại 
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public User getAdminbyRoleId(int adminId) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);

        Root<User> rU = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(builder.equal(rU.get("id"), adminId));
        predicates.add(builder.equal(rU.get("role"), "Admin"));

        query.select(rU).where(builder.and(predicates.toArray(new Predicate[0])));

        Query q = s.createQuery(query);
        return (User) q.getSingleResult();

    }

    @Override
    public boolean authenticated(String username, String password) {
        User u = this.getUserByUsername(username);
        return this.passwordEncoder.matches(password, u.getPassword());
    }

    @Override
    public User updateUser(User u) {
        Session s = factory.getObject().getCurrentSession();

        s.merge(u);
        return u;

    }
    //dùng truyền id trong license vào để cập nhật trạng thại tài khoản doctor

    @Override
    public User getUserbyId(int id) {
        Session s = factory.getObject().getCurrentSession();
        return s.get(User.class, id);
    }

    @Override
    public Map<String, Object> changePassword(String username, String currentPassword, String newPassword) {
        Session s = this.factory.getObject().getCurrentSession();
        Map<String, Object> res = new HashMap<>();//Dung de tra ra ket qua de ben font-end de xu ly
        User u = this.getUserByUsername(username);

        if (u == null) {
            res.put("success", false);
            res.put("message", "User không tồn tại");
            return res;
        }

        if (!this.passwordEncoder.matches(currentPassword, u.getPassword())) {
            res.put("success", false);
            res.put("message", "Sai mật khẩu");
            return res;
        }

        u.setPassword(passwordEncoder.encode(newPassword));
        s.update(u);

        res.put("success", true);
        res.put("message", "Đổi mật khẩu thành công");
        return res;

    }

}
