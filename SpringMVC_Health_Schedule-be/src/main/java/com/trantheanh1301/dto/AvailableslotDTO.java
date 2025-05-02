/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.dto;

import java.util.Date;

/**
 *
 * @author thean
 */
//Dùng cho slot -> doctor của của thông tin clinic và specialty -> từ việc set trong service
public class AvailableslotDTO {

    private Integer slotId;
    private Date slotDate;
    private Date startTime;
    private Date endTime;
    private Boolean isBooked;
    private Date createdAt;
    //Khỏi sửa để tránh sửa trên FE
    private DoctorDTO doctorId;

    public AvailableslotDTO() {
    }

    public AvailableslotDTO(Integer slotId, Date slotDate, Date startTime, Date endTime, Boolean isBooked, Date createdAt, DoctorDTO doctorId) {
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isBooked = isBooked;
        this.createdAt = createdAt;
        this.doctorId = doctorId;
    }



    /**
     * @return the slotId
     */
    public Integer getSlotId() {
        return slotId;
    }

    /**
     * @param slotId the slotId to set
     */
    public void setSlotId(Integer slotId) {
        this.slotId = slotId;
    }

    /**
     * @return the slotDate
     */
    public Date getSlotDate() {
        return slotDate;
    }

    /**
     * @param slotDate the slotDate to set
     */
    public void setSlotDate(Date slotDate) {
        this.slotDate = slotDate;
    }

    /**
     * @return the startTime
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the isBooked
     */
    public Boolean getIsBooked() {
        return isBooked;
    }

    /**
     * @param isBooked the isBooked to set
     */
    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }

    /**
     * @return the createdAt
     */
    public Date getCreatedAt() {
        return createdAt;
    }

    /**
     * @param createdAt the createdAt to set
     */
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * @return the doctorId
     */
    public DoctorDTO getDoctorId() {
        return doctorId;
    }

    /**
     * @param doctorId the doctorId to set
     */
    public void setDoctorId(DoctorDTO doctorId) {
        this.doctorId = doctorId;
    }

    /**
     * @return the doctorDTO
     */

    
    
}
