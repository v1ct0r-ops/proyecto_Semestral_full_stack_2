package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ItemPedidoRequest {
    @Schema(description = "Código del producto", example = "PROD001")
    private String productoCodigo;

    @Schema(description = "Cantidad solicitada", example = "2")
    private Integer cantidad;

    public ItemPedidoRequest() {}
    public ItemPedidoRequest(String productoCodigo, Integer cantidad) {
        this.productoCodigo = productoCodigo;
        this.cantidad = cantidad;
    }
    public String getProductoCodigo() { return productoCodigo; }
    public void setProductoCodigo(String productoCodigo) { this.productoCodigo = productoCodigo; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
