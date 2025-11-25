package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public class CrearPedidoRequest {
    @Schema(description = "Lista de items del pedido")
    private List<ItemPedidoRequest> items;

    @Schema(description = "Dirección de entrega", example = "Av. Siempre Viva 123")
    private String direccion;

    @Schema(description = "Región de entrega", example = "Metropolitana")
    private String region;

    @Schema(description = "Comuna de entrega", example = "Santiago")
    private String comuna;

    @Schema(description = "Puntos LevelUp a usar", example = "10")
    private Integer puntosAUsar;

    public CrearPedidoRequest() {}

    public List<ItemPedidoRequest> getItems() { return items; }
    public void setItems(List<ItemPedidoRequest> items) { this.items = items; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public Integer getPuntosAUsar() { return puntosAUsar; }
    public void setPuntosAUsar(Integer puntosAUsar) { this.puntosAUsar = puntosAUsar; }
}
