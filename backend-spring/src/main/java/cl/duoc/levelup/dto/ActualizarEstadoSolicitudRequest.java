package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ActualizarEstadoSolicitudRequest {
    @Schema(description = "Nuevo estado de la solicitud", example = "resuelta")
    private String estado;

    public ActualizarEstadoSolicitudRequest() {}
    public ActualizarEstadoSolicitudRequest(String estado) { this.estado = estado; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
