/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Availableslot;
import java.util.List;
import java.util.Map;

/**
 *
 * @author LAPTOP
 */
public interface AvailabeslotRepository {

    public List<Availableslot> findSlot(Map<String, String> params);

}
