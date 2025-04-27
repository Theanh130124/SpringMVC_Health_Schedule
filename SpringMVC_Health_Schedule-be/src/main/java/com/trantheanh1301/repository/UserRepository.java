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
    public User getUserByUsername(String username);
    public User getUserByEmail(String email);
    public User register(User u);
    public boolean authenticated(String username , String password);
    public User getAdminbyRoleId(int adminId);
    public User updateUser(User u);
    public User getUserbyId(int id);
    
}
