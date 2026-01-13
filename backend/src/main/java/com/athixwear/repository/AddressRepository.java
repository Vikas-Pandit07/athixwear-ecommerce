package com.athixwear.repository;

import com.athixwear.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    // Find all addresses for a user
    List<Address> findByUserUserId(Integer userId);
    
    // Find default address for a user
    Optional<Address> findByUserUserIdAndIsDefaultTrue(Integer userId);
    
    // Find addresses by user and city
    List<Address> findByUserUserIdAndCity(Integer userId, String city);
    
    // Clear all default addresses for a user
    @Modifying
    @Transactional
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.userId = :userId")
    void clearDefaultAddresses(@Param("userId") Integer userId);
    
    // Count addresses for a user
    long countByUserUserId(Integer userId);
    
    // Delete all addresses for a user
    void deleteByUserUserId(Integer userId);
}