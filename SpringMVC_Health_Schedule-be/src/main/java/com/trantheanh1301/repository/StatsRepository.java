/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface StatsRepository {
    //lượt đã khám và doanh thu và loại bệnh
    public List<Object[]> statsCountExaminedTotalAmount(Map <String,String> params);
    public List<Object[]> statsDiagnosedCountExamined(Map <String,String> params);
    void timePredicate(CriteriaBuilder builder , Root<?> root,List<Predicate> predicates,Map<String, String> params, String timeFieldName);
    
}
