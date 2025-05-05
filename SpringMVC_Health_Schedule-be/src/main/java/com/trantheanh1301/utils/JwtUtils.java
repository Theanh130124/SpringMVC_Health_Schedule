/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.trantheanh1301.utils;

/**
 *
 * @author LAPTOP
 */
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    // SECRET nên được lưu bằng biến môi trường, -> nhứ sửa
    private static final String SECRET = "12345678901234567890123456789012"; // 32 ký tự (AES key)
    private static final long EXPIRATION_MS = 864000000; // 1 ngày -> mình đã chỉnh lên 10 ngày

    public static String generateToken(String username,List<String> roles) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);
         //Thế anh đã bổ sung role ở đây để có thể dùng @PreAuthorize  ,
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .claim("roles", roles)   // thêm claim chứa danh sách roles
                
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .issueTime(new Date())
                .build();
        //
        System.out.println("Roles from token: " + roles);

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public static String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiration.after(new Date())) {
                return signedJWT.getJWTClaimsSet().getSubject();
            }
        }
        return null;
    }
    
    //Đã bổ sung để lấy role 
    
    public static List<String> getRoles(String token) throws Exception {
    SignedJWT signedJWT = SignedJWT.parse(token);
    return (List<String>) signedJWT.getJWTClaimsSet().getClaim("roles");
}


}
