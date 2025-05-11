/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.repository;

import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.pojo.Review;

/**
 *
 * @author Asus
 */
public interface InvoiceRepository {
    
    public Invoice addInvoice(Invoice invoice);
    public Invoice updatePaymentStatusInvoice(Invoice invoice);
    public Invoice getInvoiceById(int id);
    public Invoice getInvoiceByAppointmentId(int id);
}
