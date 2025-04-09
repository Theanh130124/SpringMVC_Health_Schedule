/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.User;

/**
 *
 * @author LAPTOP
 */
public interface UserRepository  {
    User getUserByUsername(String username);
    User register(User u);
    
}
