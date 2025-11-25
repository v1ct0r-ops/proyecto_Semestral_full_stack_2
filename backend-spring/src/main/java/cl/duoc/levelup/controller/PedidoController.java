package cl.duoc.levelup.controller;

import cl.duoc.levelup.entity.Pedido;
import cl.duoc.levelup.security.UserPrincipal;
import cl.duoc.levelup.service.PedidoService;
import cl.duoc.levelup.dto.CrearPedidoRequest;
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
import cl.duoc.levelup.dto.ActualizarEstadoPedidoRequest;

@RestController
@RequestMapping("/api/v1/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Pedidos", description = "Gestión de pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Operation(summary = "Crear pedido", description = "Crea un nuevo pedido para el usuario autenticado")
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CrearPedidoRequest request) {
        try {
            Pedido pedido = pedidoService.crearPedido(userPrincipal, request);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Obtener mis pedidos", description = "Devuelve la lista de pedidos del usuario autenticado")
    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> getMisPedidos(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Pedido> pedidos = pedidoService.obtenerPedidosUsuario(userPrincipal.getRun());
        return ResponseEntity.ok(pedidos);
    }

    @Operation(summary = "Obtener pedido por ID", description = "Devuelve el pedido correspondiente al ID especificado")
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) {
        return pedidoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener todos los pedidos", description = "Devuelve la lista de todos los pedidos (solo ADMIN y VENDEDOR)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        List<Pedido> pedidos = pedidoService.obtenerTodosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @Operation(summary = "Actualizar estado de pedido", description = "Actualiza el estado de un pedido (solo ADMIN y VENDEDOR)")
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    public ResponseEntity<Pedido> actualizarEstado(
            @PathVariable Long id,
            @RequestBody ActualizarEstadoPedidoRequest estadoRequest) {
        Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(estadoRequest.getEstado());
        Pedido pedido = pedidoService.actualizarEstado(id, nuevoEstado);
        return ResponseEntity.ok(pedido);
    }

    @Operation(summary = "Cancelar pedido", description = "Cancela el pedido correspondiente al ID especificado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id) {
        try {
            pedidoService.cancelarPedido(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}