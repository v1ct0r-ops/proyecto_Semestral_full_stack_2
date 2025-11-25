package cl.duoc.levelup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterRequest {
    
    @Schema(description = "Nombre del usuario", example = "Juan")
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String nombre;
    
    @Schema(description = "Apellido del usuario", example = "Pérez")
    @NotBlank(message = "El apellido es requerido")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String apellido;
    
    @Schema(description = "RUN del usuario", example = "12345678-9")
    @NotBlank(message = "El RUN es requerido")
    @Pattern(regexp = "^[0-9]{7,8}-[0-9Kk]$", message = "El RUN debe tener el formato correcto (ej: 12345678-9)")
    private String run;
    
    @Schema(description = "Correo electrónico", example = "juan.perez@duoc.cl")
    @NotBlank(message = "El email es requerido")
    @Email(message = "El formato del email no es válido")
    private String email;
    
    @Schema(description = "Contraseña", example = "password123")
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password;
    
    @Schema(description = "Teléfono", example = "+56912345678")
    @NotBlank(message = "El teléfono es requerido")
    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "El teléfono debe tener un formato válido")
    private String telefono;
    
    @Schema(description = "Dirección", example = "Av. Siempre Viva 123")
    @NotBlank(message = "La dirección es requerida")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccion;
    
    // Constructor vacío
    public RegisterRequest() {}
    
    // Constructor con todos los datos
    public RegisterRequest(String nombre, String apellido, String run, String email, 
                         String password, String telefono, String direccion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.run = run;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.direccion = direccion;
    }
    
    // Métodos para obtener y modificar atributos
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    
    public String getRun() {
        return run;
    }
    
    public void setRun(String run) {
        this.run = run;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}