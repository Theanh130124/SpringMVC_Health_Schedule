package com.trantheanh1301.filters;

import com.trantheanh1301.utils.JwtUtils;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

public class JwtFilter implements Filter {

    // Danh sách các API không cần JWT
    private static final List<String> WHITELIST = Arrays.asList(
            "/api/login",       // Đăng nhập
            "/api/users",       // Đăng ký tài khoản bệnh nhân
            "/api/doctor",      // Tìm kiếm bác sĩ ngoài trang chủ
            "/api/payment/" ,  // Tất cả các endpoint dưới /api/payment
            "/api/find_slot"
            );




    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();
        String contextPath = httpRequest.getContextPath();

        // Cắt bỏ contextPath để lấy đường dẫn chính xác
        String path = requestURI.substring(contextPath.length());

        // Log ra URL để kiểm tra
        System.out.println("Request Path: " + path);

        // Kiểm tra xem API có yêu cầu JWT không (không phải trong whitelist)
        if (path.startsWith("/api") && !isInWhitelist(path)) {
            String header = httpRequest.getHeader("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header.");
                return;
            }

            String token = header.substring(7); // Loại bỏ "Bearer " và lấy token
            try {
                String username = JwtUtils.validateTokenAndGetUsername(token);
                if (username != null) {
                    httpRequest.setAttribute("username", username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null, null);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    chain.doFilter(request, response);
                    return;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ hoặc hết hạn");
            return;
        }

        // Nếu nằm trong whitelist hoặc không phải /api
        chain.doFilter(request, response);
    }

    // Kiểm tra xem URL có phải là một trong các endpoint không yêu cầu JWT
    private boolean isInWhitelist(String path) {
        for (String whitePath : WHITELIST) {
            // Kiểm tra nếu đường dẫn chứa "/api/payment/" hoặc các endpoint whitelist khác
            if (path.equals(whitePath)) {
                return true;
            }
        }
        return false;
    }
}
