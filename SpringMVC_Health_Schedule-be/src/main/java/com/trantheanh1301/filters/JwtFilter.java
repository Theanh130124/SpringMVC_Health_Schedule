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

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import java.util.stream.Collectors;
import org.springframework.util.AntPathMatcher;

public class JwtFilter implements Filter {

    // Danh sách các API không cần JWT
    private static final List<String> WHITELIST = Arrays.asList(
            "/api/login", // Đăng nhập
            "/api/users", // Đăng ký tài khoản bệnh nhân
            "/api/doctor/**", // Tìm kiếm bác sĩ ngoài trang chủ
            "/api/find_slot",
            "/api/reviews/**",
<<<<<<< Updated upstream
            "/api/payment/momo/ipn"
=======
            "/api/doctor_license"//chưa có quyền dùng hệ thống nên chưa lưu token 
            
>>>>>>> Stashed changes
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

                    List<String> roles = JwtUtils.getRoles(token);  // Lấy roles từ token

                    List<GrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    //
                    System.out.println("Authorities in context: " + authorities);

                    UsernamePasswordAuthenticationToken authentication
                            = new UsernamePasswordAuthenticationToken(username, null, authorities);

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
    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean isInWhitelist(String path) {
        //Kiểm tra cả 2 loại đường dẫn
        //Đường dẫn cố định như /api/login
        //Đường dẫn động như /reviews/{doctorId}...
        return WHITELIST.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }
}
