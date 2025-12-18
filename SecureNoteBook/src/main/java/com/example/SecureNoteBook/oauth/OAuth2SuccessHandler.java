package com.example.SecureNoteBook.oauth;

import com.example.SecureNoteBook.jwt.JwtUtils;
import com.example.SecureNoteBook.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final String frontendUrl;

    public OAuth2SuccessHandler(
            JwtUtils jwtUtils,
            UserService userService,
            @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl
    ) {
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.frontendUrl = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1)
                : frontendUrl;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        if (response.isCommitted()) return;

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String principal;
        String provider;

        if (oauthUser.getAttribute("login") != null) {
            // GitHub
            provider = "GITHUB";
            principal = "github:" + oauthUser.getAttribute("login");

        } else if (oauthUser.getAttribute("email") != null) {
            // Google
            provider = "GOOGLE";
            principal = "google:" + oauthUser.getAttribute("email");

        } else {
            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Unsupported OAuth provider"
            );
            return;
        }

        try {
            userService.getOrCreateOAuthUser(principal, provider);
        } catch (Exception ex) {
            response.sendError(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "User provisioning failed"
            );
            return;
        }

        String jwt = jwtUtils.generateJwtFromUsername(principal);

        response.sendRedirect(
                frontendUrl +
                        "/oauth2/success?token=" +
                        URLEncoder.encode(jwt, StandardCharsets.UTF_8)
        );
    }
}
