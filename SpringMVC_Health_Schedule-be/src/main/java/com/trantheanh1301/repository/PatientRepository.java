/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Patient;

/**
 *
 * @author LAPTOP
 */
public interface PatientRepository {
    public Patient register(Patient u);
    public Patient getPatientbyId(int id);
}
