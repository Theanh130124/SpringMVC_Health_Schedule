/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Clinic;
import java.util.Set;

/**
 *
 * @author thean
 */
public interface ClinicService {
    Clinic getClinicById (int id);
    Set<Clinic> getClinicAll();
    Clinic addOrUpdate(Clinic clinic);
}
