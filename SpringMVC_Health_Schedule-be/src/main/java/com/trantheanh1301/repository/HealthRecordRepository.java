
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Healthrecord;

/**
 *
 * @author Asus
 */
public interface HealthRecordRepository {
    public Healthrecord addHealthRecord(Healthrecord healthRecord);
    public Healthrecord getHealthRecordById(int id);
    public Healthrecord updateHealthRecord(Healthrecord healthrecord);
}

