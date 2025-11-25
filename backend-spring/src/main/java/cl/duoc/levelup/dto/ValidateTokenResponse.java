package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ValidateTokenResponse", description = "Respuesta de validación de token JWT", example = "{\n  \"valid\": true,\n  \"user\": \"usuario1\"\n}")
public class ValidateTokenResponse {
    @Schema(description = "Indica si el token es válido", example = "true")
    private boolean valid;

    @Schema(description = "Nombre de usuario autenticado", example = "usuario1")
    private String user;

    public ValidateTokenResponse() {}
    public ValidateTokenResponse(boolean valid, String user) {
        this.valid = valid;
        this.user = user;
    }
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }
    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
}
