package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "PuntosResponse", description = "Respuesta con los puntos LevelUp del usuario", example = "{\n  \"puntos\": 1500\n}")
public class PuntosResponse {
    @Schema(description = "Cantidad de puntos LevelUp", example = "1500")
    private int puntos;

    public PuntosResponse() {}
    public PuntosResponse(int puntos) { this.puntos = puntos; }
    public int getPuntos() { return puntos; }
    public void setPuntos(int puntos) { this.puntos = puntos; }
}
