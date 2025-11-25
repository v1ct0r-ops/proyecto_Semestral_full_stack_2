package cl.duoc.levelup.controller;

import cl.duoc.levelup.dto.AuthResponse;
import cl.duoc.levelup.dto.LoginRequest;
import cl.duoc.levelup.dto.RegisterRequest;
import cl.duoc.levelup.dto.RegistroUsuarioRequest;
import cl.duoc.levelup.dto.RegisterResponse;
import cl.duoc.levelup.entity.Usuario;
import cl.duoc.levelup.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://richardmoreano.github.io"})
@Tag(name = "Autenticación", description = "Endpoints para autenticación y registro de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Credenciales de inicio de sesión", required = true) @Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Credenciales inválidas: " + e.getMessage()));
        }
    }

    @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema")
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegistroUsuarioRequest registroRequest) {
        try {
            Usuario usuario = authService.registerUserFromRequest(registroRequest);
            RegisterResponse response = new RegisterResponse(true, "Usuario registrado exitosamente", usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            RegisterResponse response = new RegisterResponse(false, "Error al registrar usuario: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Operation(summary = "Cerrar sesión", description = "Cierra la sesión del usuario. Ejemplo de respuesta: {\n  \"message\": \"Logout exitoso\"\n}")
    @PostMapping("/logout")
    public ResponseEntity<cl.duoc.levelup.dto.LogoutResponse> logout() {
        cl.duoc.levelup.dto.LogoutResponse response = new cl.duoc.levelup.dto.LogoutResponse("Logout exitoso");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Validar token", description = "Valida si el token JWT es válido. Ejemplo de respuesta: {\n  \"valid\": true,\n  \"user\": \"usuario1\"\n}")
    @GetMapping("/validate")
    public ResponseEntity<cl.duoc.levelup.dto.ValidateTokenResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            cl.duoc.levelup.dto.ValidateTokenResponse response = new cl.duoc.levelup.dto.ValidateTokenResponse(true, authentication.getName());
            return ResponseEntity.ok(response);
        }
        cl.duoc.levelup.dto.ValidateTokenResponse response = new cl.duoc.levelup.dto.ValidateTokenResponse(false, null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @Operation(summary = "Obtener perfil", description = "Obtiene la información del usuario autenticado")
    @GetMapping("/profile")
    public ResponseEntity<Usuario> getProfile(Authentication authentication) {
        try {
            Usuario usuario = authService.getUserProfile(authentication.getName());
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}