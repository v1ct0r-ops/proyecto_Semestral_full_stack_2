package cl.duoc.levelup.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;

// DTO para exponer boletas al frontend sin enviar entidades completas
public class BoletaDTO {

    @Schema(description = "Número de boleta", example = "BOL-20250001")
    private String numero;

    @Schema(description = "Fecha de la boleta", example = "2025-11-10")
    private LocalDate fecha;

    @Schema(description = "Fecha y hora de creación", example = "2025-10-24T10:30:00")
    private LocalDateTime fechaCreacion;

    @Schema(description = "ID del pedido asociado", example = "123")
    private Long pedidoId;

    @Schema(description = "Nombre del cliente", example = "Richard Moreano")
    private String clienteNombre;

    @Schema(description = "Correo del cliente", example = "richard@duoc.cl")
    private String clienteCorreo;

    @Schema(description = "Subtotal de la boleta", example = "10000.00")
    private BigDecimal subtotal;

    @Schema(description = "Descuento por Duoc", example = "2000.00")
    private BigDecimal descuentoDuoc;

    @Schema(description = "Descuento por puntos", example = "500.00")
    private BigDecimal descuentoPuntos;

    @Schema(description = "Total a pagar", example = "7500.00")
    private BigDecimal total;

    public BoletaDTO() {
    }

    public BoletaDTO(String numero,
                     LocalDate fecha,
                     LocalDateTime fechaCreacion,
                     Long pedidoId,
                     String clienteNombre,
                     String clienteCorreo,
                     BigDecimal subtotal,
                     BigDecimal descuentoDuoc,
                     BigDecimal descuentoPuntos,
                     BigDecimal total) {
        this.numero = numero;
        this.fecha = fecha;
        this.fechaCreacion = fechaCreacion;
        this.pedidoId = pedidoId;
        this.clienteNombre = clienteNombre;
        this.clienteCorreo = clienteCorreo;
        this.subtotal = subtotal;
        this.descuentoDuoc = descuentoDuoc;
        this.descuentoPuntos = descuentoPuntos;
        this.total = total;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteCorreo() {
        return clienteCorreo;
    }

    public void setClienteCorreo(String clienteCorreo) {
        this.clienteCorreo = clienteCorreo;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDescuentoDuoc() {
        return descuentoDuoc;
    }

    public void setDescuentoDuoc(BigDecimal descuentoDuoc) {
        this.descuentoDuoc = descuentoDuoc;
    }

    public BigDecimal getDescuentoPuntos() {
        return descuentoPuntos;
    }

    public void setDescuentoPuntos(BigDecimal descuentoPuntos) {
        this.descuentoPuntos = descuentoPuntos;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
