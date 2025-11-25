package cl.duoc.levelup.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {
    
    @Id
    @JsonProperty("run")
    @Column(name = "run", length = 12)
    @Schema(description = "RUN del usuario", example = "12345678-9")
    private String run;
    
    @NotBlank
    @Size(max = 100)
    @JsonProperty("nombres")
    @Column(name = "nombres", nullable = false, length = 100)
    @Schema(description = "Nombres del usuario", example = "Richard")
    private String nombres;
    
    @NotBlank
    @Size(max = 100)
    @JsonProperty("apellidos")
    @Column(name = "apellidos", nullable = false, length = 100)
    @Schema(description = "Apellidos del usuario", example = "Moreano")
    private String apellidos;
    
    @Email
    @NotBlank
    @JsonProperty("correo")
    @Column(name = "correo", nullable = false, unique = true, length = 120)
    @Schema(description = "Correo electrónico", example = "richard@duoc.cl")
    private String correo;
    
    @Enumerated(EnumType.STRING)
    @JsonProperty("tipoUsuario")
    @Column(name = "tipo_usuario", nullable = false)
    @Schema(description = "Tipo de usuario", example = "ADMIN")
    private TipoUsuario tipoUsuario;
    
    @JsonProperty("region")
    @Column(name = "region", length = 100)
    @Schema(description = "Región", example = "Metropolitana")
    private String region;
    
    @JsonProperty("comuna")
    @Column(name = "comuna", length = 100)
    @Schema(description = "Comuna", example = "Santiago")
    private String comuna;
    
    @JsonProperty("direccion")
    @Column(name = "direccion", length = 200)
    @Schema(description = "Dirección", example = "Av. Siempre Viva 123")
    private String direccion;
    
    @NotBlank
    @Size(min = 4, max = 255)
    @JsonProperty("password")
    @Column(name = "password", nullable = false)
    @Schema(description = "Contraseña", example = "admin123")
    private String password;
    
    @Column(name = "puntos_levelup", nullable = false)
    @Schema(description = "Puntos LevelUp", example = "100")
    private Integer puntosLevelUp = 0;
    
    @Column(name = "fecha_registro")
    @Schema(description = "Fecha de registro", example = "2025-11-24T10:30:00")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "activo")
    @Schema(description = "Usuario activo", example = "true")
    private Boolean activo = true;
    
    // Relaciones con otras entidades
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evita problemas de serialización
    private List<Pedido> pedidos;
    
    // Constructores
    public Usuario() {
        this.fechaRegistro = LocalDateTime.now();
    }
    
    public Usuario(String run, String nombres, String apellidos, String correo, 
                   TipoUsuario tipoUsuario, String password) {
        this();
        this.run = run;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.tipoUsuario = tipoUsuario;
        this.password = password;
    }
    
    // Métodos de negocio para lógica de usuario
    public boolean tieneDescuentoDuoc() {
        return correo != null && correo.toLowerCase().endsWith("@duoc.cl");
    }
    
    public double calcularDescuentoDuoc() {
        return tieneDescuentoDuoc() ? 0.20 : 0.0;
    }
    
    public double calcularDescuentoPuntos(double subtotal) {
        if (puntosLevelUp <= 0) return 0.0;
        
    double puntosEnPesos = puntosLevelUp * 10.0; // Convierte puntos a pesos
    double maxDescuento = subtotal * 0.20; // El descuento máximo es 20%
        
        return Math.min(puntosEnPesos, maxDescuento);
    }
    
    public void usarPuntos(int puntosUsados) {
        if (puntosUsados > 0 && puntosUsados <= this.puntosLevelUp) {
            this.puntosLevelUp -= puntosUsados;
        }
    }
    
    public void ganarPuntos(int puntosGanados) {
        if (puntosGanados > 0) {
            this.puntosLevelUp += puntosGanados;
        }
    }
    
    // Métodos para obtener y modificar atributos
    public String getRun() { return run; }
    public void setRun(String run) { this.run = run; }
    
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Integer getPuntosLevelUp() { return puntosLevelUp; }
    public void setPuntosLevelUp(Integer puntosLevelUp) { this.puntosLevelUp = puntosLevelUp; }
    
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }
    
    // Tipos de usuario
    public enum TipoUsuario {
        ADMIN, VENDEDOR, CLIENTE
    }
}