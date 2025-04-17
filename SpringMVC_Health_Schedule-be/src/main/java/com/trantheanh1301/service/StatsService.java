/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface StatsService {
    List<Object[]> statsCountExaminedTotalAmount(Map <String,String> params);
    List<Object[]> statsDiagnosedCountExamined(Map <String,String> params);
    void timePredicate(CriteriaBuilder builder , Root<?> root,List<Predicate> predicates,Map<String, String> params, String timeFieldName);
}
