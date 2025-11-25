package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta del estado de la API y base de datos")
public class HealthResponse {
    @Schema(description = "Estado del servicio", example = "UP")
    private String status;

    @Schema(description = "Nombre del servicio", example = "Level-Up Gamer API")
    private String service;

    @Schema(description = "Timestamp actual", example = "1700851200000")
    private long timestamp;

    @Schema(description = "Estado de la base de datos", example = "UP")
    private String database;

    @Schema(description = "Error de la base de datos si existe", example = "")
    private String databaseError;

    @Schema(description = "Perfil activo", example = "dev")
    private String[] profile;

    @Schema(description = "Versión de Java", example = "17.0.8")
    private String javaVersion;

    public HealthResponse() {}

    // Métodos para obtener y modificar atributos
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }
    public String getDatabaseError() { return databaseError; }
    public void setDatabaseError(String databaseError) { this.databaseError = databaseError; }
    public String[] getProfile() { return profile; }
    public void setProfile(String[] profile) { this.profile = profile; }
    public String getJavaVersion() { return javaVersion; }
    public void setJavaVersion(String javaVersion) { this.javaVersion = javaVersion; }
}
