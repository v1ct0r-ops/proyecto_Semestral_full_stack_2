package cl.duoc.levelup.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "boletas")
public class Boleta {
    
    @Id
    @Column(name = "numero", length = 20)
    private String numero;
    
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore  // Evita serialización circular
    private Pedido pedido;
    
    @Column(name = "cliente_nombre", nullable = false, length = 200)
    private String clienteNombre;
    
    @Column(name = "cliente_correo", length = 120)
    private String clienteCorreo;
    
    @Column(name = "subtotal", precision = 12, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "descuento_duoc", precision = 12, scale = 2)
    private BigDecimal descuentoDuoc = BigDecimal.ZERO;
    
    @Column(name = "descuento_puntos", precision = 12, scale = 2)
    private BigDecimal descuentoPuntos = BigDecimal.ZERO;
    
    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;
    
    // Constructores
    public Boleta() {
        this.fecha = LocalDate.now();
        this.fechaCreacion = LocalDateTime.now();
    }
    
    public Boleta(Pedido pedido) {
        this();
        this.pedido = pedido;
        this.numero = generarNumeroBoleta();
        
        if (pedido.getUsuario() != null) {
            Usuario usuario = pedido.getUsuario();
            this.clienteNombre = usuario.getNombres() + " " + usuario.getApellidos();
            this.clienteCorreo = usuario.getCorreo();
        }
        
        this.subtotal = pedido.getSubtotal();
        this.descuentoDuoc = pedido.getDescuentoDuoc();
        this.descuentoPuntos = pedido.getDescuentoPuntos();
        this.total = pedido.getTotal();
    }
    
    // Métodos de negocio
    private String generarNumeroBoleta() {
        long timestamp = System.currentTimeMillis();
        return "BOL-" + String.valueOf(timestamp).substring(7); // Últimos 6 dígitos
    }
    
    // Getters y Setters
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    
    public String getClienteCorreo() { return clienteCorreo; }
    public void setClienteCorreo(String clienteCorreo) { this.clienteCorreo = clienteCorreo; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getDescuentoDuoc() { return descuentoDuoc; }
    public void setDescuentoDuoc(BigDecimal descuentoDuoc) { this.descuentoDuoc = descuentoDuoc; }
    
    public BigDecimal getDescuentoPuntos() { return descuentoPuntos; }
    public void setDescuentoPuntos(BigDecimal descuentoPuntos) { this.descuentoPuntos = descuentoPuntos; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}