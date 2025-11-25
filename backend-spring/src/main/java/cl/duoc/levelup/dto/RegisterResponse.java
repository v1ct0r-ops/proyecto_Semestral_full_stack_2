package cl.duoc.levelup.dto;

import cl.duoc.levelup.entity.Usuario;
import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterResponse {
    @Schema(description = "Indica si el registro fue exitoso", example = "true")
    private boolean success;

    @Schema(description = "Mensaje de respuesta", example = "Usuario registrado exitosamente")
    private String message;

    @Schema(description = "Datos del usuario registrado")
    private Usuario usuario;

    public RegisterResponse() {}

    public RegisterResponse(boolean success, String message, Usuario usuario) {
        this.success = success;
        this.message = message;
        this.usuario = usuario;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
