/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Doctoravailability;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface DoctorAvailabilityService {
    List<Doctoravailability> findAvailableTime(Map<String , String> params);
}
