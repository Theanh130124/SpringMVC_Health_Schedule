/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Specialty;
import java.util.Set;

/**
 *
 * @author thean
 */
public interface SpecialtyService {
    Specialty getSpecialtyById(int id);
    Set<Specialty> getAllSpecialty();
    Specialty addOrUpdate(Specialty specialty);
}
