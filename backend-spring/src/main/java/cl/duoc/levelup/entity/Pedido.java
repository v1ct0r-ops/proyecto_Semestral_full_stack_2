package cl.duoc.levelup.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID del pedido", example = "1001")
    private Long id;
    
    @Column(name = "fecha", nullable = false)
    @Schema(description = "Fecha del pedido", example = "2025-10-24T10:30:00")
    private LocalDateTime fecha;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @Schema(description = "Estado del pedido", example = "PENDIENTE")
    private EstadoPedido estado;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "run_cliente", referencedColumnName = "run", nullable = false)
    @Schema(description = "Usuario que realizó el pedido")
    private Usuario usuario;
    
    @Column(name = "region", length = 100)
    @Schema(description = "Región de entrega", example = "Metropolitana")
    private String region;
    
    @Column(name = "comuna", length = 100)
    @Schema(description = "Comuna de entrega", example = "Santiago")
    private String comuna;
    
    @Column(name = "direccion", length = 200)
    @Schema(description = "Dirección de entrega", example = "Av. Siempre Viva 123")
    private String direccion;
    
    @Column(name = "subtotal", precision = 12, scale = 2)
    @Schema(description = "Subtotal del pedido", example = "25000.00")
    private BigDecimal subtotal;
    
    @Column(name = "descuento_duoc", precision = 12, scale = 2)
    @Schema(description = "Descuento DUOC", example = "5000.00")
    private BigDecimal descuentoDuoc = BigDecimal.ZERO;
    
    @Column(name = "descuento_puntos", precision = 12, scale = 2)
    @Schema(description = "Descuento por puntos", example = "2000.00")
    private BigDecimal descuentoPuntos = BigDecimal.ZERO;
    
    @Column(name = "total", precision = 12, scale = 2)
    @Schema(description = "Total a pagar", example = "18000.00")
    private BigDecimal total;
    
    // Relaciones
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("pedido-items")  // Evita serialización circular
    private List<PedidoItem> items;
    
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evita serialización circular
    private Boleta boleta;
    
    // Constructores
    public Pedido() {
        this.fecha = LocalDateTime.now();
        this.estado = EstadoPedido.PENDIENTE;
    }
    
    public Pedido(Usuario usuario) {
        this();
        this.usuario = usuario;
    }
    
    // Métodos de negocio
    public void calcularTotales() {
        if (items == null || items.isEmpty()) {
            this.subtotal = BigDecimal.ZERO;
            this.total = BigDecimal.ZERO;
            return;
        }
        
        // Calcular subtotal
        this.subtotal = items.stream()
            .map(item -> item.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Aplicar descuentos
        if (usuario != null) {
            // Descuento DUOC
            double porcentajeDuoc = usuario.calcularDescuentoDuoc();
            this.descuentoDuoc = subtotal.multiply(BigDecimal.valueOf(porcentajeDuoc));
            
            // Descuento por puntos
            double descuentoPuntosCalculado = usuario.calcularDescuentoPuntos(subtotal.doubleValue());
            this.descuentoPuntos = BigDecimal.valueOf(descuentoPuntosCalculado);
        }
        
        // Total final
        this.total = subtotal.subtract(descuentoDuoc).subtract(descuentoPuntos);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }
    }
    
    public void marcarComoDespachado() {
        if (estado != EstadoPedido.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden despachar pedidos pendientes");
        }
        
        // Descontar stock de productos
        if (items != null) {
            items.forEach(item -> {
                Producto producto = item.getProducto();
                producto.descontarStock(item.getCantidad());
            });
        }
        
        // Usar puntos del usuario si hay descuento por puntos
        if (descuentoPuntos.compareTo(BigDecimal.ZERO) > 0 && usuario != null) {
            int puntosUsados = descuentoPuntos.divide(BigDecimal.valueOf(10)).intValue();
            usuario.usarPuntos(puntosUsados);
        }
        
        this.estado = EstadoPedido.DESPACHADO;
    }
    
    public void cancelar() {
        if (estado == EstadoPedido.DESPACHADO) {
            throw new IllegalStateException("No se puede cancelar un pedido ya despachado");
        }
        this.estado = EstadoPedido.CANCELADO;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    
    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getDescuentoDuoc() { return descuentoDuoc; }
    public void setDescuentoDuoc(BigDecimal descuentoDuoc) { this.descuentoDuoc = descuentoDuoc; }
    
    public BigDecimal getDescuentoPuntos() { return descuentoPuntos; }
    public void setDescuentoPuntos(BigDecimal descuentoPuntos) { this.descuentoPuntos = descuentoPuntos; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public List<PedidoItem> getItems() { return items; }
    public void setItems(List<PedidoItem> items) { this.items = items; }
    
    public Boleta getBoleta() { return boleta; }
    public void setBoleta(Boleta boleta) { this.boleta = boleta; }
    
    // Enum para estados
    public enum EstadoPedido {
        PENDIENTE, DESPACHADO, CANCELADO
    }
}