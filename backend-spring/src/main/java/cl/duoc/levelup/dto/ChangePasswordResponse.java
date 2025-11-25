package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "ChangePasswordResponse", description = "Respuesta para cambio de contraseña", example = "{\n  \"success\": true\n}")
public class ChangePasswordResponse {
    @Schema(description = "Indica si el cambio fue exitoso", example = "true")
    private boolean success;

    public ChangePasswordResponse() {}
    public ChangePasswordResponse(boolean success) { this.success = success; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
