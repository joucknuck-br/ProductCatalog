package com.qima.product_catalog.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qima.product_catalog.model.AuthRequest;
import com.qima.product_catalog.model.AuthResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
    setFilterProcessesUrl("/login");
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    try {
      AuthRequest authRequest = new ObjectMapper().readValue(request.getInputStream(), AuthRequest.class);
      UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
              authRequest.getUsername(),
              authRequest.getPassword()
      );
      return authenticationManager.authenticate(authenticationToken);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
    String token = jwtUtil.generateToken((org.springframework.security.core.userdetails.User) authResult.getPrincipal());
    AuthResponse authResponse = new AuthResponse();
    authResponse.setToken(token);
    authResponse.setMessage("Authentication successful");

    response.setContentType("application/json");
    response.getWriter().write(new ObjectMapper().writeValueAsString(authResponse));
    response.getWriter().flush();
  }

  @Override
  protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
    AuthResponse authResponse = new AuthResponse();
    authResponse.setMessage("Authentication failed");

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.getWriter().write(new ObjectMapper().writeValueAsString(authResponse));
    response.getWriter().flush();
  }
}