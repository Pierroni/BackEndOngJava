package com.Caminhar.api.infra.security;


import com.Caminhar.api.infra.tokenService.TokenService;
import com.Caminhar.api.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(SecurityFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        logger.info("Requisição recebida: {}", requestURI);

        var authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            var token = authHeader.replace("Bearer ", "");
            var login = tokenService.validateToken(token);

            if (login.isEmpty()) {
                logger.error("Token inválido ou expirado");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido ou expirado");
                return;
            }

            UserDetails user = userRepository.findByLogin(login);
            if (user == null) {
                logger.error("Usuário não encontrado para o token: {}", login);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Usuário não encontrado");
                return;
            }

            DecodedJWT decodedJWT = JWT.decode(token);
            String role = decodedJWT.getClaim("role").asString();
            var authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

            var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Sempre continua – o Spring Security decide se a rota precisa de auth
        filterChain.doFilter(request, response);
    }
}
