package com.athixwear.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {
    
    @NotNull
    private Long addressId;
    
    @NotBlank
    private String paymentMethod; // "COD", "RAZORPAY"
    
    public Long getAddressId() {
        return addressId;
    }
    
    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}