/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Specialty;
import java.util.Set;

/**
 *
 * @author thean
 */
public interface SpecialtyRepository {
    public Specialty getSpecialtyById(int id);
    public Set<Specialty> getAllSpecialty();
    public Specialty addOrUpdate(Specialty s);
    
}
