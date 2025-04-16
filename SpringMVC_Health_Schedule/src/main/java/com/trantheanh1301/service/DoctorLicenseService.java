/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Doctorlicense;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface DoctorLicenseService {
    Doctorlicense registerLicense(Map<String, String> params);
    Doctorlicense updateLicense(int id , Map<String,String> params);
    public void removeLicense(int id);
    
}
