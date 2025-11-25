package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LogoutResponse", description = "Respuesta al cerrar sesión", example = "{\n  \"message\": \"Logout exitoso\"\n}")
public class LogoutResponse {
    @Schema(description = "Mensaje de confirmación de logout", example = "Logout exitoso")
    private String message;

    public LogoutResponse() {}
    public LogoutResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
