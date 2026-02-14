package com.athixwear.repository;

import com.athixwear.entity.Role;
import com.athixwear.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
	// optional prevents nullpointer exception
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
 
    //existence check for validation
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    
    // active user check
    Optional<User> findByUsernameAndActiveTrue(String username);
    
    // total user count by role
    Long countByRole(@Param("role") Role  role);

    List<User> findByRole(Role role, Pageable pageable);
}
