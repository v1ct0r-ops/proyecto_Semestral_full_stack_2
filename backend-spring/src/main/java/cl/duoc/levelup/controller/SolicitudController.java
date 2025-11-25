package cl.duoc.levelup.controller;

import cl.duoc.levelup.dto.SolicitudContactoRequest;
import cl.duoc.levelup.entity.Solicitud;
import cl.duoc.levelup.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import cl.duoc.levelup.dto.ActualizarEstadoSolicitudRequest;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000",
    "https://richardmoreano.github.io"
})
@Tag(name = "Solicitudes", description = "Gestión de solicitudes de contacto")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    // Endpoint público para crear una solicitud de contacto desde el formulario
    @Operation(summary = "Crear solicitud de contacto", description = "Crea una nueva solicitud de contacto pública")
    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(
            @Valid @RequestBody SolicitudContactoRequest request) {
        Solicitud creada = solicitudService.crearSolicitud(request);
        return ResponseEntity
                .created(URI.create("/api/solicitudes/" + creada.getId()))
                .body(creada);
    }

    @Operation(summary = "Obtener todas las solicitudes", description = "Devuelve la lista de todas las solicitudes (solo ADMIN)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Solicitud>> getAll() {
        return ResponseEntity.ok(solicitudService.obtenerTodas());
    }

    @Operation(summary = "Obtener solicitud por ID", description = "Devuelve la solicitud correspondiente al ID especificado (solo ADMIN)")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Solicitud> getById(@PathVariable Long id) {
        return ResponseEntity.ok(solicitudService.obtenerPorId(id));
    }

    @Operation(summary = "Obtener solicitudes por estado", description = "Devuelve la lista de solicitudes filtradas por estado (solo ADMIN)")
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Solicitud>> getByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(solicitudService.obtenerPorEstado(estado));
    }

    @Operation(summary = "Actualizar estado de solicitud", description = "Actualiza el estado de una solicitud (solo ADMIN)")
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Solicitud> updateEstado(
            @PathVariable Long id,
            @RequestBody ActualizarEstadoSolicitudRequest estadoRequest) {
        String estado = estadoRequest.getEstado();
        Solicitud actualizada = solicitudService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizada);
    }

    @Operation(summary = "Eliminar solicitud", description = "Elimina una solicitud (solo ADMIN)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        solicitudService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
