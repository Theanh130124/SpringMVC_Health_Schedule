/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Clinic;
import java.util.Set;

/**
 *
 * @author LAPTOP
 */

public interface ClinicRepository {
    public Clinic getClinicById (int id);
    public Set<Clinic> getClinicAll();
    public Clinic addOrUpdate(Clinic clinic);
}
