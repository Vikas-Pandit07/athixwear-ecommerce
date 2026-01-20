package com.athixwear.dto;

import java.math.BigDecimal;

public class OrderItemResponse {
    
    private Integer orderItemId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
   
    public Integer getOrderItemId() { 
    	return orderItemId; 
    }
    public void setOrderItemId(Integer orderItemId) { 
    	this.orderItemId = orderItemId; 
    }
    public Integer getProductId() { 
    	return productId; 
    }
    public void setProductId(Integer productId) { 
    	this.productId = productId; 
    }
    public String getProductName() { 
    	return productName; 
    }
    public void setProductName(String productName) { 
    	this.productName = productName; 
    }
    public String getProductImage() {
    	return productImage; 
    }
    public void setProductImage(String productImage) { 
    	this.productImage = productImage; 
    }   
    public Integer getQuantity() { 
    	return quantity; 
    }
    public void setQuantity(Integer quantity) { 
    	this.quantity = quantity; 
    }
    public BigDecimal getPrice() { 
    	return price; 
    }
    public void setPrice(BigDecimal price) { 
    	this.price = price; 
    }  
    public BigDecimal getTotalPrice() { 
    	return totalPrice; 
    }
    public void setTotalPrice(BigDecimal totalPrice) { 
    	this.totalPrice = totalPrice; 
    }
}
