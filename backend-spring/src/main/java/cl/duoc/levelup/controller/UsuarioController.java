package cl.duoc.levelup.controller;

import cl.duoc.levelup.entity.Usuario;
import cl.duoc.levelup.security.UserPrincipal;
import cl.duoc.levelup.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import cl.duoc.levelup.dto.CambiarPasswordRequest;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://richardmoreano.github.io"})
@Tag(name = "Usuarios", description = "Gestión de usuarios y perfil")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Obtener usuario actual", description = "Devuelve el usuario autenticado actualmente")
    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Usuario usuario = usuarioService.obtenerUsuarioAutenticado(userPrincipal);
        return ResponseEntity.ok(usuario);
    }

    @Operation(summary = "Actualizar usuario actual", description = "Actualiza los datos del usuario autenticado")
    @PutMapping("/me")
    public ResponseEntity<Usuario> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody Usuario usuarioActualizado) {
        Usuario usuario = usuarioService.actualizarUsuario(userPrincipal.getRun(), usuarioActualizado);
        return ResponseEntity.ok(usuario);
    }

    @Operation(summary = "Cambiar contraseña", description = "Cambia la contraseña del usuario autenticado. Ejemplo de request: {\n  \"passwordActual\": \"123456\",\n  \"nuevaPassword\": \"nuevaClave123\"\n}. Ejemplo de respuesta: {\n  \"success\": true\n}")
    @PostMapping("/me/cambiar-password")
    public ResponseEntity<cl.duoc.levelup.dto.ChangePasswordResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody CambiarPasswordRequest passwordRequest) {
        String passwordActual = passwordRequest.getPasswordActual();
        String nuevaPassword = passwordRequest.getNuevaPassword();
        boolean success = usuarioService.cambiarPassword(userPrincipal.getRun(), passwordActual, nuevaPassword);
        cl.duoc.levelup.dto.ChangePasswordResponse response = new cl.duoc.levelup.dto.ChangePasswordResponse(success);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener puntos del usuario", description = "Devuelve los puntos LevelUp del usuario autenticado. Ejemplo de respuesta: {\n  \"puntos\": 1500\n}")
    @GetMapping("/puntos")
    public ResponseEntity<cl.duoc.levelup.dto.PuntosResponse> getPuntos(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Usuario usuario = usuarioService.obtenerUsuarioAutenticado(userPrincipal);
        cl.duoc.levelup.dto.PuntosResponse response = new cl.duoc.levelup.dto.PuntosResponse(usuario.getPuntosLevelUp());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener todos los usuarios", description = "Devuelve la lista de todos los usuarios registrados. Solo puede ser usado por un usuario con rol ADMIN.")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getAllUsers() {
        List<Usuario> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Obtener usuarios activos", description = "Devuelve la lista de usuarios activos (solo ADMIN)")
    @GetMapping("/activos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getActiveUsers() {
        List<Usuario> usuarios = usuarioService.obtenerActivos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Obtener usuarios por tipo", description = "Devuelve la lista de usuarios filtrados por tipo (solo ADMIN)")
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getUsersByType(@PathVariable Usuario.TipoUsuario tipo) {
        List<Usuario> usuarios = usuarioService.obtenerPorTipo(tipo);
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Obtener usuario por RUN", description = "Devuelve el usuario correspondiente al RUN especificado (solo ADMIN)")
    @GetMapping("/{run}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> getUserByRun(@PathVariable String run) {
        return usuarioService.obtenerPorRun(run)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "Actualizar usuario por RUN",
        description = "Actualiza los datos de un usuario específico identificado por su RUN. Solo puede ser usado por un usuario con rol ADMIN. Recibe el RUN como parámetro en la URL y un objeto Usuario en el cuerpo de la petición con los datos actualizados. Retorna el usuario actualizado."
    )
    @PutMapping("/{run}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> updateUser(@PathVariable String run, @Valid @RequestBody Usuario usuario) {
        Usuario usuarioActualizado = usuarioService.actualizarUsuario(run, usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }


    @Operation(
        summary = "Agregar puntos a usuario",
        description = "Agrega puntos LevelUp al usuario identificado por su RUN. Solo puede ser usado por un usuario con rol ADMIN. Recibe el RUN como parámetro en la URL y la cantidad de puntos en el cuerpo de la petición. Retorna el usuario actualizado."
    )
    @PostMapping("/{run}/puntos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Usuario> addPoints(@PathVariable String run, @RequestBody cl.duoc.levelup.dto.AgregarPuntosRequest pointsRequest) {
        Integer puntos = pointsRequest.getPuntos();
        Usuario usuario = usuarioService.agregarPuntos(run, puntos);
        return ResponseEntity.ok(usuario);
    }

    @Operation(
        summary = "Obtener usuarios por dominio",
        description = "Devuelve la lista de usuarios filtrados por dominio de correo electrónico. Solo puede ser usado por un usuario con rol ADMIN. Recibe el dominio como parámetro en la URL. Retorna la lista de usuarios."
    )
    @GetMapping("/dominio/{dominio}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getUsersByDomain(@PathVariable String dominio) {
        List<Usuario> usuarios = usuarioService.obtenerPorDominio(dominio);
        return ResponseEntity.ok(usuarios);
    }

    @Operation(
        summary = "Obtener usuarios con puntos mínimos",
        description = "Devuelve la lista de usuarios que tienen al menos la cantidad mínima de puntos LevelUp especificada. Solo puede ser usado por un usuario con rol ADMIN. Recibe el valor mínimo como parámetro en la URL. Retorna la lista de usuarios."
    )
    @GetMapping("/puntos-minimos/{minPuntos}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> getUsersWithMinPoints(@PathVariable Integer minPuntos) {
        List<Usuario> usuarios = usuarioService.obtenerConPuntosMinimos(minPuntos);
        return ResponseEntity.ok(usuarios);
    }

        @Operation(
            summary = "Eliminar usuario por RUN",
            description = "Eliminar al usuario identificado por su RUN. Solo puede ser usado por un usuario con rol ADMIN. Recibe el RUN como parámetro en la URL. No retorna contenido."
        )
        @DeleteMapping("/{run}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Void> deleteUser(@PathVariable String run) {
            usuarioService.desactivarUsuario(run);
            return ResponseEntity.noContent().build();
        }

}