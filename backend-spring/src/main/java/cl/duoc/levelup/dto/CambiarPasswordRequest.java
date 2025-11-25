package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class CambiarPasswordRequest {
    @Schema(description = "Contraseña actual del usuario", example = "123456")
    private String passwordActual;

    @Schema(description = "Nueva contraseña", example = "nuevaClave123")
    private String nuevaPassword;

    public CambiarPasswordRequest() {}
    public CambiarPasswordRequest(String passwordActual, String nuevaPassword) {
        this.passwordActual = passwordActual;
        this.nuevaPassword = nuevaPassword;
    }
    public String getPasswordActual() { return passwordActual; }
    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
}
