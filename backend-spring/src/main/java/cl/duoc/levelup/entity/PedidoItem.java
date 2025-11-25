package cl.duoc.levelup.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "pedido_items")
public class PedidoItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID del item de pedido", example = "1")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference("pedido-items")  // Evita problemas de serialización
    @Schema(description = "Pedido asociado")
    private Pedido pedido;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codigo_producto", referencedColumnName = "codigo", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @Schema(description = "Producto asociado")
    private Producto producto;
    
    @Column(name = "cantidad", nullable = false)
    @Schema(description = "Cantidad solicitada", example = "2")
    private Integer cantidad;
    
    @Column(name = "precio", nullable = false, precision = 12, scale = 2)
    @Schema(description = "Precio unitario", example = "19990.00")
    private BigDecimal precio;
    
    // Constructores
    public PedidoItem() {}
    
    public PedidoItem(Pedido pedido, Producto producto, Integer cantidad, BigDecimal precio) {
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = precio;
    }
    
    // Métodos para lógica de negocio
    public BigDecimal calcularSubtotal() {
        return precio.multiply(BigDecimal.valueOf(cantidad));
    }
    
    // Métodos para obtener y modificar atributos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}