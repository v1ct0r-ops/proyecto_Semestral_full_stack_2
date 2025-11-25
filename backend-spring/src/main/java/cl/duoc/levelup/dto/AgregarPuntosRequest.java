package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class AgregarPuntosRequest {
    @Schema(description = "Cantidad de puntos a agregar", example = "50")
    private Integer puntos;

    public AgregarPuntosRequest() {}
    public AgregarPuntosRequest(Integer puntos) { this.puntos = puntos; }
    public Integer getPuntos() { return puntos; }
    public void setPuntos(Integer puntos) { this.puntos = puntos; }
}
