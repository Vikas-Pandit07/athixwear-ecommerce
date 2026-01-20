package com.athixwear.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    public Address addAddress(Map<String, Object> request) {
        User user = userService.getCurrentUser();
        
        Address address = new Address();
        address.setUser(user);
        address.setFullName((String) request.get("fullName"));
        address.setPhone((String) request.get("phone"));
        address.setAddressLine((String) request.get("addressLine"));
        address.setCity((String) request.get("city"));
        address.setState((String) request.get("state"));
        address.setPinCode((String) request.get("pinCode"));
        address.setCountry((String) request.getOrDefault("country", "India"));
        address.setDefault((Boolean) request.getOrDefault("isDefault", false));
        
        // If this is set as default, unset other defaults
        if (address.isDefault()) {
            addressRepository.clearDefaultAddresses(user.getUserId());
        }
        
        return addressRepository.save(address);
    }
    
    @Transactional
    public Address updateAddress(Integer addressId, Map<String, Object> request) {
        User user = userService.getCurrentUser();
        
        Address address = addressRepository.findByAddressIdAndUserUserIdAndIsActiveTrue(addressId, user.getUserId())
            .orElseThrow(() -> new RuntimeException("Address not found"));
        
        address.setFullName((String) request.getOrDefault("fullName", address.getFullName()));
        address.setPhone((String) request.getOrDefault("phone", address.getPhone()));
        address.setAddressLine((String) request.getOrDefault("addressLine", address.getAddressLine()));
        address.setCity((String) request.getOrDefault("city", address.getCity()));
        address.setState((String) request.getOrDefault("state", address.getState()));
        address.setPinCode((String) request.getOrDefault("pinCode", address.getPinCode()));
        
        boolean isDefault = (Boolean) request.getOrDefault("isDefault", address.isDefault());
        
        // If setting as default, unset other defaults
        if (isDefault && !address.isDefault()) {
            addressRepository.clearDefaultAddresses(user.getUserId());
            address.setDefault(true);
        } else if (!isDefault && address.isDefault()) {
            address.setDefault(false);
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
