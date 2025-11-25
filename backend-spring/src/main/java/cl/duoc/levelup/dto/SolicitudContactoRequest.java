package cl.duoc.levelup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

public class SolicitudContactoRequest {

    @Schema(description = "Nombre del contacto", example = "Ana Torres")
    @NotBlank
    @Size(max = 100)
    private String nombre;

    @Schema(description = "Correo electrónico", example = "ana.torres@duoc.cl")
    @NotBlank
    @Email
    @Size(max = 120)
    private String correo;

    @Schema(description = "Descripción del mensaje", example = "Quiero consultar sobre el producto X")
    @NotBlank
    @Size(max = 1000)
    private String descripcion;

    public SolicitudContactoRequest() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
