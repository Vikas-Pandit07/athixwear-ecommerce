package com.athixwear.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.athixwear.dto.AddAddressRequest;
import com.athixwear.dto.UpdateAddressRequest;
import com.athixwear.entity.Address;
import com.athixwear.service.AddressService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<?> getUserAddresses() {
        List<Address> addresses = addressService.getUserAddresses();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "addresses", addresses
        ));
    }

    @PostMapping
    public ResponseEntity<?> addAddress(
            @Valid @RequestBody AddAddressRequest request) {

        Address address = addressService.addAddress(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Address added successfully",
                "address", address
        ));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Integer addressId,
            @Valid @RequestBody UpdateAddressRequest request) {

        Address address = addressService.updateAddress(addressId, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Address updated successfully",
                "address", address
        ));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Address removed successfully"
        ));
    }

    @PutMapping("/{addressId}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Integer addressId) {
        addressService.setDefaultAddress(addressId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Default address set successfully"
        ));
    }
}
