package com.athixwear.dto;

import java.math.BigDecimal;

public class CartItemResponse {
	
	private Integer cartItemId;
	private Integer productId;
	private String productName;
	private String prodctImage;
	private BigDecimal price;
	private Integer quantity;
	private BigDecimal totalPrice;
	public Integer getCartItemId() {
		return cartItemId;
	}
	public void setCartItemId(Integer cartItemId) {
		this.cartItemId = cartItemId;
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
	public String getProdctImage() {
		return prodctImage;
	}
	public void setProdctImage(String prodctImage) {
		this.prodctImage = prodctImage;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public BigDecimal getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}
	
	
}
