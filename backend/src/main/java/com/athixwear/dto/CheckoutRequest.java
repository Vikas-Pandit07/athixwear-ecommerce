package com.athixwear.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {
    
    @NotNull
    private Integer addressId;
    
    @NotBlank
    private String paymentMethod; // "COD", "RAZORPAY"
    
    public Integer getAddressId() {
        return addressId;
    }
    
    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}