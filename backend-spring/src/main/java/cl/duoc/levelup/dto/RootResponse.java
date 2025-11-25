package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Schema(description = "Respuesta del endpoint raíz de la API")
public class RootResponse {
    @Schema(description = "Nombre de la aplicación", example = "Level-Up Gamer API")
    private String application;

    @Schema(description = "Versión de la API", example = "1.0.0")
    private String version;

    @Schema(description = "Estado de la API", example = "running")
    private String status;

    @Schema(description = "Mensaje de estado", example = "Backend is working correctly")
    private String message;

    @Schema(description = "Perfil activo", example = "dev")
    private String[] profile;

    @Schema(description = "Puerto de la API", example = "8080")
    private String port;

    @Schema(description = "Endpoints disponibles")
    private Map<String, String> endpoints;

    public RootResponse() {}

    // Métodos para obtener y modificar atributos
    public String getApplication() { return application; }
    public void setApplication(String application) { this.application = application; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String[] getProfile() { return profile; }
    public void setProfile(String[] profile) { this.profile = profile; }
    public String getPort() { return port; }
    public void setPort(String port) { this.port = port; }
    public Map<String, String> getEndpoints() { return endpoints; }
    public void setEndpoints(Map<String, String> endpoints) { this.endpoints = endpoints; }
}
