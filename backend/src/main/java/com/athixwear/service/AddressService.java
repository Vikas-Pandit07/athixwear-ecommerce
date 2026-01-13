package com.athixwear.service;

import com.athixwear.dto.AddressResponse;
import com.athixwear.dto.CreateAddressRequest;
import com.athixwear.entity.Address;
import com.athixwear.entity.User;
import com.athixwear.repository.AddressRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserService userService;
    
    public AddressService(AddressRepository addressRepository, UserService userService) {
        this.addressRepository = addressRepository;
        this.userService = userService;
    }
    
    public AddressResponse addAddress(CreateAddressRequest request) {
        User currentUser = userService.getCurrentUser();
        
        Address address = new Address();
        address.setUser(currentUser);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());
        
        // If this is set as default, unset other defaults
        if (request.isDefault()) {
            addressRepository.clearDefaultAddresses(currentUser.getUserId());
        }
        
        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }
    
    public List<AddressResponse> getUserAddresses() {
        User currentUser = userService.getCurrentUser();
        List<Address> addresses = addressRepository.findByUserUserId(currentUser.getUserId());
        
        return addresses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteAddress(Long addressId) {
        User currentUser = userService.getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        // Check if address belongs to current user
        if (!address.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new RuntimeException("Not authorized to delete this address");
        }
        
        addressRepository.delete(address);
    }
    
    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setAddressId(address.getAddressId());
        response.setFullName(address.getFullName());
        response.setPhone(address.getPhone());
        response.setAddressLine(address.getAddressLine());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPinCode(address.getPinCode());
        response.setCountry(address.getCountry());
        response.setDefault(address.isDefault());
        return response;
    }
}