
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Healthrecord;
import java.util.Map;

/**
 *
 * @author Asus
 */

public interface HealthRecordService {
    public Healthrecord addHealthRecord(Map<String,String> params);
    public Healthrecord getHealthRecordById(int id);
    public Healthrecord updateHealthRecord(int id, Map<String,String>params);
}
