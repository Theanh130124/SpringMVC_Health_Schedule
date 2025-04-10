/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.repository.StatsRepository;
import com.trantheanh1301.service.StatsService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author LAPTOP
 */
@Service
public class StatsServiceImpl implements StatsService{

    @Autowired
    private StatsRepository statsRepository;

    @Override
    public List<Object[]> statsCountExaminedTotalAmount(Map<String, String> params) {
        return statsRepository.statsCountExaminedTotalAmount(params);
    }

    @Override
    public void timePredicate(CriteriaBuilder builder, Root<?> root, List<Predicate> predicates, Map<String, String> params, String timeFieldName) {
        statsRepository.timePredicate(builder, root, predicates, params, timeFieldName);
    }

}
