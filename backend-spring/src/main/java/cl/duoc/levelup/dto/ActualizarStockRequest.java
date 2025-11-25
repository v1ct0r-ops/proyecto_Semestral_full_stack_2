package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ActualizarStockRequest {
    @Schema(description = "Nuevo stock del producto", example = "25")
    private Integer stock;

    public ActualizarStockRequest() {}
    public ActualizarStockRequest(Integer stock) { this.stock = stock; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
