package com.athixwear.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.athixwear.entity.JwtToken;

import jakarta.transaction.Transactional;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Integer> {

    Optional<JwtToken> findByTokenAndRevokedFalse(String token);

    @Modifying
    @Transactional
    @Query("UPDATE JwtToken t SET t.revoked = true WHERE t.user.userId = :userId")
    void revokeAllByUserId(int userId);
}
