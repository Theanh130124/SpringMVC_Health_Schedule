/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.service.impl;

import com.trantheanh1301.formatter.DateFormatter;
import com.trantheanh1301.pojo.Appointment;
import com.trantheanh1301.pojo.Invoice;
import com.trantheanh1301.repository.AppointmentRepository;
import com.trantheanh1301.repository.InvoiceRepository;
import com.trantheanh1301.service.InvoiceService;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Asus
 */
@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Invoice addInvoice(Map<String, String> params) {

        Invoice invoice = new Invoice();
        invoice.setAmount(new BigDecimal(params.get("amount")));
        invoice.setDueDate(DateFormatter.parseDate(params.get("dueDate")));
        invoice.setAppointmentId(appointmentRepository.getAppointmentById(Integer.valueOf(params.get("appointmentId"))));
        return this.invoiceRepository.addInvoice(invoice);
    }

    @Override
    public Invoice updatePaymentStatusInvoice(int id, Map<String, String> params) {

        Invoice invoice = this.invoiceRepository.getInvoiceById(id);
        String status = params.get("status");
        if (status == null || status.isEmpty()) {
            status = "Pending"; // hoặc báo lỗi nếu bắt buộc
        }
        invoice.setStatus(status);
        return this.invoiceRepository.updatePaymentStatusInvoice(invoice);
    }

}
