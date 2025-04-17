/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.formatter.StatsFormatter;
import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Healthrecord;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.repository.StatsRepository;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
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
public class StatsRepositoryImpl implements StatsRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Object[]> statsCountExaminedTotalAmount(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);

        Root<Appointment> rA = query.from(Appointment.class);
        //join qua invoice qua "invoice"
        Join<Appointment, Invoice> joinInvoice = rA.join("invoice", JoinType.INNER);

        List<Predicate> predicates = new ArrayList<>();

        timePredicate(builder, rA, predicates, params, "appointmentTime");
        Expression<Integer> year = builder.function("YEAR", Integer.class, rA.get("appointmentTime"));
        Expression<Integer> month = builder.function("MONTH", Integer.class, rA.get("appointmentTime"));
        Expression<Integer> quarter = builder.function("QUARTER", Integer.class, rA.get("appointmentTime"));

        //Đếm tổng tiền với lịch hẹn đã hoàn thành
        query.multiselect(
                builder.count(rA.get("appointmentId")),
                builder.sum(joinInvoice.get("amount")),
                year, quarter, month
        );

        predicates.add(builder.equal(rA.get("status"), "Completed"));
        predicates.add(builder.equal(joinInvoice.get("status"), "Paid"));

        query.where(predicates.toArray(Predicate[]::new));
        query.groupBy(year, quarter, month);
        query.orderBy(builder.asc(year), builder.asc(month));
        Query q = session.createQuery(query);

        return q.getResultList();
    }

    @Override
    public List<Object[]> statsDiagnosedCountExamined(Map<String, String> params) {
        Session session = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = builder.createQuery(Object[].class);

        Root<Appointment> rA = query.from(Appointment.class);
        //join Để lấy chuẩn đoán bệnh -> loại bệnh (theo tháng năm) -> không join không lấy theo tháng nằm được (vì đang groupby theo thằng kia)
        Join<Appointment, Healthrecord> joinHealthRecord = rA.join("healthrecordSet", JoinType.INNER);

        List<Predicate> predicates = new ArrayList<>();

        timePredicate(builder, rA, predicates, params, "appointmentTime");
        Expression<Integer> year = builder.function("YEAR", Integer.class, rA.get("appointmentTime"));
        Expression<Integer> month = builder.function("MONTH", Integer.class, rA.get("appointmentTime"));
        Expression<Integer> quarter = builder.function("QUARTER", Integer.class, rA.get("appointmentTime"));

        query.multiselect(
                builder.count(rA.get("appointmentId")),
                joinHealthRecord.get("diagnosis"),
                year, quarter, month
        );
        predicates.add(builder.equal(rA.get("status"), "Completed"));
        query.where(predicates.toArray(Predicate[]::new));
        query.groupBy(year, quarter, month,joinHealthRecord.get("diagnosis"));
        query.orderBy(builder.asc(year), builder.asc(month));
        Query q = session.createQuery(query);

        return q.getResultList();
    }

    @Override
    public void timePredicate(CriteriaBuilder builder, Root<?> root, List<Predicate> predicates, Map<String, String> params, String timeFieldName) {
        Expression<Integer> year = builder.function("YEAR", Integer.class, root.get(timeFieldName));
        Expression<Integer> month = builder.function("MONTH", Integer.class, root.get(timeFieldName));
        Expression<Integer> quarter = builder.function("QUARTER", Integer.class, root.get(timeFieldName));
        String y = params.get("year");
        if (y != null && !y.isEmpty()) {
            predicates.add(builder.equal(year, Integer.valueOf(y)));

            String q = params.get("quarter");
            String m = params.get("month");

            if (q != null && !q.isEmpty()) {
                predicates.add(builder.equal(quarter, Integer.valueOf(q)));
            } else if (m != null && !m.isEmpty()) {
                predicates.add(builder.equal(month, Integer.valueOf(m)));
            }
        }

    }

}
