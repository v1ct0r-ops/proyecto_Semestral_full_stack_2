package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "DisponibilidadResponse", description = "Respuesta de disponibilidad de producto", example = "{\n  \"disponible\": true\n}")
public class DisponibilidadResponse {
    @Schema(description = "Indica si hay suficiente stock para la cantidad solicitada", example = "true")
    private boolean disponible;

    public DisponibilidadResponse() {}
    public DisponibilidadResponse(boolean disponible) { this.disponible = disponible; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
