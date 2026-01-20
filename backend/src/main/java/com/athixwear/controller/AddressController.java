package com.athixwear.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.athixwear.entity.Address;
import com.athixwear.service.AddressService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/addresses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AddressController {
    
    private final AddressService addressService;
    
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }
    
    @GetMapping
    public ResponseEntity<?> getUserAddresses() {
        try {
            List<Address> addresses = addressService.getUserAddresses();
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "addresses", addresses
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Map<String, Object> request) {
        try {
            Address address = addressService.addAddress(request);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Address added successfully",
                "address", address
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Integer addressId,
            @RequestBody Map<String, Object> request) {
        try {
            Address address = addressService.updateAddress(addressId, request);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Address updated successfully",
                "address", address
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer addressId) {
        try {
            addressService.deleteAddress(addressId);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Address removed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PutMapping("/{addressId}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Integer addressId) {
        try {
            addressService.setDefaultAddress(addressId);
            return ResponseEntity.ok().body(Map.of(
                "success", true,
                "message", "Default address set successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
