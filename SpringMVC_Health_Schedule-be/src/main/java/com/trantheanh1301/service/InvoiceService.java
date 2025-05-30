/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service;

import com.trantheanh1301.pojo.Invoice;
import java.security.Principal;
import java.util.Map;

/**
 *
 * @author Asus
 */
public interface InvoiceService {
    public Invoice addInvoice(Map<String,String> params);
    public Invoice updatePaymentStatusInvoice(int id, Map<String,String> params);
    public Invoice getInvoiceByAppointmentId(int id, Principal principal);
    public Invoice getInvoiceById(int id);
}
