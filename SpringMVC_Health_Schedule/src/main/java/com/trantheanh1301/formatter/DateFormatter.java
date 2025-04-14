/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.formatter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author LAPTOP
 */
public class DateFormatter {

    public static Date parseDate(String input) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.parse(input);
        } catch (ParseException e) {
            e.printStackTrace();
            return null; // hoặc throw new RuntimeException("Sai định dạng ngày");
        }
    }

    public static String formatDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        return sdf.format(date);
    }
}
