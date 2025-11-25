package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ActualizarEstadoPedidoRequest {
    @Schema(description = "Nuevo estado del pedido", example = "DESPACHADO")
    private String estado;

    public ActualizarEstadoPedidoRequest() {}
    public ActualizarEstadoPedidoRequest(String estado) { this.estado = estado; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
