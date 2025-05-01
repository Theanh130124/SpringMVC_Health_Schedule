/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Patient;

/**
 *
 * @author LAPTOP
 */
public interface PatientService {
    public Patient register(Patient u);
    public Patient getPatientById(int id);
}
