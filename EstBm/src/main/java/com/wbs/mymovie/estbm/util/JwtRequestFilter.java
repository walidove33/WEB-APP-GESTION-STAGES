package com.wbs.mymovie.estbm.util;


import com.wbs.mymovie.estbm.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        logger.info(">>> Authorization header = " + authHeader);

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.info(">>> Raw token = " + token);

            boolean valid = jwtUtil.validateJwtToken(token);
            logger.info(">>> validateJwtToken(token) = " + valid);

            if (valid) {
                username = jwtUtil.getUsernameFromJwt(token);
                logger.info("✅ JWT valide pour user = " + username);
            } else {
                logger.warn("❌ JWT invalide");
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Claims claims = jwtUtil.extractAllClaims(token);
            logger.info(">>> Claims = " + claims);

            Object rolesObj = claims.get("authorities");
            logger.info(">>> rolesObj = " + rolesObj);

            @SuppressWarnings("unchecked")
            List<String> roles = ((List<?>) rolesObj).stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
            logger.info(">>> roles (List<String>) = " + roles);

            List<GrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
            logger.info(">>> authorities = " + authorities);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            logger.info(">>> SecurityContextHolder updated with authentication");
        }

        filterChain.doFilter(request, response);
    }
}
