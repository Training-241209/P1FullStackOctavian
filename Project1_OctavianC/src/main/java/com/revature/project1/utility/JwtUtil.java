package com.revature.project1.utility;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.revature.project1.config.JwtConfiguration;

@Component
public class JwtUtil {

    @Autowired
    private JwtConfiguration jwtConfiguration;

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*4))
                .signWith(SignatureAlgorithm.HS256, jwtConfiguration.getSecretKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(jwtConfiguration.getSecretKey())
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(jwtConfiguration.getSecretKey())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}


