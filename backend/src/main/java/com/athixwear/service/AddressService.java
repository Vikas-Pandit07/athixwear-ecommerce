package com.athixwear.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.athixwear.dto.AddAddressRequest;
import com.athixwear.dto.UpdateAddressRequest;
import com.athixwear.entity.Address;
import com.athixwear.entity.User;
import com.athixwear.repository.AddressRepository;
import java.util.List;
import java.util.Map;

@Service
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserService userService;
    
    public AddressService(AddressRepository addressRepository, UserService userService) {
        this.addressRepository = addressRepository;
        this.userService = userService;
    }
    
    public List<Address> getUserAddresses() {
        User user = userService.getCurrentUser();
        return addressRepository.findByUserUserIdAndIsActiveTrue(user.getUserId());
    }
    
    @Transactional
    public Address addAddress(AddAddressRequest request) {
        User user = userService.getCurrentUser();
        
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());
        
        // If this is set as default, unset other defaults
        if (address.isDefault()) {
            addressRepository.clearDefaultAddresses(user.getUserId());
        }
        
        return addressRepository.save(address);
    }
    
    @Transactional
    public Address updateAddress(Integer addressId, UpdateAddressRequest request) {
        User user = userService.getCurrentUser();
        
        Address address = addressRepository.findByAddressIdAndUserUserIdAndIsActiveTrue(addressId, user.getUserId())
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (request.getFullName() != null) address.setFullName(request.getFullName());
        if (request.getPhone() != null) address.setPhone(request.getPhone());
        if (request.getAddressLine() != null) address.setAddressLine(request.getAddressLine());
        if (request.getCity() != null) address.setCity(request.getCity());
        if (request.getState() != null) address.setState(request.getState());
        if (request.getPinCode() != null) address.setPinCode(request.getPinCode());

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.clearDefaultAddresses(user.getUserId());
            address.setDefault(true);
        }
        
        return addressRepository.save(address);
    }
    
    @Transactional
    public void deleteAddress(Integer addressId) {
        User user = userService.getCurrentUser();
        
        // Soft delete - mark as inactive instead of hard delete
        int updated = addressRepository.deactivateAddress(addressId, user.getUserId());
        
        if (updated == 0) {
            throw new RuntimeException("Address not found or not authorized");
        }
    }
    
    @Transactional
    public void setDefaultAddress(Integer addressId) {
        User user = userService.getCurrentUser();
        
        Address address = addressRepository.findByAddressIdAndUserUserIdAndIsActiveTrue(addressId, user.getUserId())
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Clear all defaults first
        addressRepository.clearDefaultAddresses(user.getUserId());
        
        // Set this as default
        address.setDefault(true);
        addressRepository.save(address);
    }
}