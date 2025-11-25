package cl.duoc.levelup.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import cl.duoc.levelup.dto.RootResponse;
import cl.duoc.levelup.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@Tag(name = "Health", description = "Endpoints de estado y raíz de la API")
public class HealthController {

    @Autowired
    private Environment env;

    @Autowired
    private DataSource dataSource;

    @Operation(summary = "Endpoint raíz", description = "Devuelve información básica de la API y endpoints disponibles")
    @GetMapping("/")
    public ResponseEntity<RootResponse> root() {
        RootResponse response = new RootResponse();
        response.setApplication("Level-Up Gamer API");
        response.setVersion("1.0.0");
        response.setStatus("running");
        response.setMessage("Backend is working correctly");
        response.setProfile(env.getActiveProfiles());
        response.setPort(env.getProperty("server.port", "8080"));
        response.setEndpoints(Map.of(
            "health", "/health",
            "auth", "/api/v1/auth",
            "products", "/api/v1/productos",
            "users", "/api/v1/usuarios",
            "swagger", "/swagger-ui.html"
        ));
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Endpoint de estado", description = "Devuelve el estado de la API y la base de datos")
    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        HealthResponse response = new HealthResponse();
        response.setStatus("UP");
        response.setService("Level-Up Gamer API");
        response.setTimestamp(System.currentTimeMillis());
    // Verifica la conexión a la base de datos
        try {
            Connection connection = dataSource.getConnection();
            connection.close();
            response.setDatabase("UP");
        } catch (Exception e) {
            response.setDatabase("DOWN");
            response.setDatabaseError(e.getMessage());
        }
    // Obtiene información del entorno
        response.setProfile(env.getActiveProfiles());
        response.setJavaVersion(System.getProperty("java.version"));
        return ResponseEntity.ok(response);
    }
}