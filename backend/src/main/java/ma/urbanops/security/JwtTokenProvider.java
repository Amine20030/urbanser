package ma.urbanops.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT token provider using JJWT 0.12.x API.
 *
 * KEY CHANGE from 0.11.x to 0.12.x:
 *   OLD (0.11.x): Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody()
 *   NEW (0.12.x): Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationInMs;

    /**
     * Build the signing key from the configured Base64-encoded secret.
     * JJWT 0.12.x requires Base64 decoding for secure key generation.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername());
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        // JJWT 0.12.x: new method names — subject(), issuedAt(), expiration(), signWith()
        return Jwts.builder()
                .subject(username)           // 0.12.x: .subject() instead of .setSubject()
                .issuedAt(now)               // 0.12.x: .issuedAt() instead of .setIssuedAt()
                .expiration(expiryDate)      // 0.12.x: .expiration() instead of .setExpiration()
                .signWith(getSigningKey())   // 0.12.x: algorithm inferred from key
                .compact();
    }

    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationInMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .id("refresh")
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract the username (subject) from a JWT token.
     * FIX 2 & 3: JJWT 0.12.x parser API — parser().verifyWith().build().parseSignedClaims().getPayload()
     */
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()                    // 0.12.x: parser() not parserBuilder()
                .verifyWith(getSigningKey())               // 0.12.x: verifyWith() not setSigningKey()
                .build()
                .parseSignedClaims(token)                  // 0.12.x: parseSignedClaims() not parseClaimsJws()
                .getPayload();                             // 0.12.x: getPayload() not getBody()

        return claims.getSubject();
    }

    /**
     * Validate a JWT token signature and format.
     * FIX 2 & 3: Updated to JJWT 0.12.x parser API.
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }

    public long getExpirationTime() {
        return jwtExpirationInMs;
    }
}
