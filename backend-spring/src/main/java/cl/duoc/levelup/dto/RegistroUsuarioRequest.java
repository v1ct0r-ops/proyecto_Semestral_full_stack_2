package cl.duoc.levelup.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class RegistroUsuarioRequest {
    @Schema(description = "RUN del usuario", example = "12345678-9")
    private String run;

    @Schema(description = "Nombres del usuario", example = "Juan Carlos")
    private String nombres;

    @Schema(description = "Apellidos del usuario", example = "Pérez Soto")
    private String apellidos;

    @Schema(description = "Correo electrónico", example = "juan.perez@duoc.cl")
    private String correo;

    @Schema(description = "Contraseña", example = "password123")
    private String password;

    @Schema(description = "Tipo de usuario", example = "CLIENTE")
    private String tipoUsuario;

    @Schema(description = "Región", example = "Metropolitana")
    private String region;

    @Schema(description = "Comuna", example = "Santiago")
    private String comuna;

    @Schema(description = "Dirección", example = "Av. Siempre Viva 123")
    private String direccion;
    
    // Constructor vacío
    public RegistroUsuarioRequest() {}
    
    // Métodos para obtener y modificar atributos
    public String getRun() { return run; }
    public void setRun(String run) { this.run = run; }
    
    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }
    
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}