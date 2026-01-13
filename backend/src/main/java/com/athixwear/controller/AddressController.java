package com.athixwear.controller;

import com.athixwear.dto.AddressResponse;
import com.athixwear.dto.CreateAddressRequest;
import com.athixwear.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {
    
    private final AddressService addressService;
    
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }
    
    @PostMapping
    public ResponseEntity<?> addAddress(@Valid @RequestBody CreateAddressRequest request) {
        try {
            AddressResponse address = addressService.addAddress(request);
            return ResponseEntity.ok().body(Map.of(
                "message", "Address added successfully",
                "address", address
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserAddresses() {
        try {
            List<AddressResponse> addresses = addressService.getUserAddresses();
            return ResponseEntity.ok().body(Map.of("addresses", addresses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId) {
        try {
            addressService.deleteAddress(addressId);
            return ResponseEntity.ok().body(Map.of("message", "Address deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}