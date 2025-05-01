/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository.impl;

import com.trantheanh1301.dto.DoctorDTO;
import com.trantheanh1301.mapperdto.DoctorMapper;
import com.trantheanh1301.pojo.Availableslot;
import com.trantheanh1301.pojo.Doctor;
import com.trantheanh1301.repository.AvailabeslotRepository;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author LAPTOP
 */
@Repository
@PropertySource("classpath:configs.properties")
@Transactional
public class AvailabeslotRepositoryImpl implements AvailabeslotRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Autowired
    private Environment env;
//Fix chi hien lich trong tu ngay hien tai den ve sau -> order by decs

    @Override
    public List<Availableslot> findSlot(Map<String, String> params) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Availableslot> query = builder.createQuery(Availableslot.class);
        Root<Availableslot> rA = query.from(Availableslot.class);
        List<Predicate> predicates = new ArrayList<>();

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));


        if (params != null) {
            if (params.containsKey("doctorId") && params.get("doctorId") != null) {
                int doctorId = Integer.parseInt(params.get("doctorId"));
                Doctor doctor = new Doctor();
                doctor.setDoctorId(doctorId);
                predicates.add(builder.equal(rA.get("doctorId"), doctor));
            }

            if (params.containsKey("slotDate") && params.get("slotDate") != null) {
                LocalDate slotDate = LocalDate.parse(params.get("slotDate"));

                // Nếu ngày truyền vào < hôm nay 
                if (slotDate.isBefore(today)) {
                    return new ArrayList<>();
                }

                predicates.add(builder.equal(rA.get("slotDate"), slotDate));
                //Chọn giờ thì phải chọn cả ngày
                if (params.containsKey("startTime") && params.get("startTime") != null) {
                    LocalTime startTime = LocalTime.parse(params.get("startTime"));
                    predicates.add(builder.greaterThanOrEqualTo(rA.get("startTime"), startTime));
                }

                if (params.containsKey("endTime") && params.get("endTime") != null) {
                    LocalTime endTime = LocalTime.parse(params.get("endTime"));
                    predicates.add(builder.lessThanOrEqualTo(rA.get("endTime"), endTime));
                }
            } else {
                // Nếu không truyền ngày thì lọc từ hôm nay trở đi
                predicates.add(builder.greaterThanOrEqualTo(rA.get("slotDate"), today));
            }
        } else {
            predicates.add(builder.greaterThanOrEqualTo(rA.get("slotDate"), today));
        }

        // Mặc định chỉ lấy slot chưa đặt
        predicates.add(builder.isFalse(rA.get("isBooked")));
        query.select(rA);

        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }

        // Sắp xếp giảm dần theo ngày và giờ
        query.orderBy(
                builder.desc(rA.get("slotDate")),
                builder.desc(rA.get("startTime"))
        );

        Query q = s.createQuery(query);

        if (params != null) {
            String page = params.get("page");
            if (page != null && !page.isEmpty()) {
                int pageSize = Integer.parseInt(this.env.getProperty("PAGE_SIZE_DOCTOR"));
                int p = Integer.parseInt(page);
                int start = (p - 1) * pageSize;

                q.setFirstResult(start);
                q.setMaxResults(pageSize);
            }
        }

        return q.getResultList();
    }

//bên đặt lịch truyền cả ngày giờ hẹn
    @Override
    public Availableslot getSlotbyDoctorId(int doctorId, Date time) {
        Session s = factory.getObject().getCurrentSession();
        CriteriaBuilder builder = s.getCriteriaBuilder();
        CriteriaQuery<Availableslot> query = builder.createQuery(Availableslot.class);
        Root<Availableslot> rA = query.from(Availableslot.class);
        List<Predicate> predicates = new ArrayList<>();

        //Tìm cái lịch như này đã 
        Doctor doctor = new Doctor();
        doctor.setDoctorId(doctorId);
        
//                //Để có thể truy vấn specialty và clinic -> đã @Jsonignore
//        DoctorDTO doctorDTO = DoctorMapper.toDoctorDTO(doctor);
//        
//        predicates.add(builder.equal(rA.get("doctorId"), doctorDTO));
        
        predicates.add(builder.equal(rA.get("doctorId"), doctor));
        predicates.add(builder.lessThanOrEqualTo(rA.get("startTime"), time));
        predicates.add(builder.greaterThanOrEqualTo(rA.get("endTime"), time));

        predicates.add(builder.equal(rA.get("isBooked"), false));
        query.select(rA).where(predicates.toArray(new Predicate[0]));

        Query q = s.createQuery(query);

        try {
            return (Availableslot) q.getSingleResult(); // Trả về slot nếu có
        } catch (NoResultException ex) {
            return null; // Không có slot phù hợp
        }

    }

    @Override
    public Availableslot addOrUpdate(Availableslot slot) {
        Session s = factory.getObject().getCurrentSession();
        if (slot == null) {
            s.persist(slot);
        } else {
            s.merge(slot);
        }
        return slot;
    }

}
