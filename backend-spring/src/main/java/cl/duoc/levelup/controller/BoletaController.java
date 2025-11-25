package cl.duoc.levelup.controller;

import cl.duoc.levelup.dto.BoletaDTO;
import cl.duoc.levelup.entity.Boleta;
import cl.duoc.levelup.service.BoletaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boletas")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000",
    "https://richardmoreano.github.io"
})
@Tag(name = "Boletas", description = "Gestión de boletas")
public class BoletaController {
    @Autowired
    private BoletaService boletaService;
    @Operation(summary = "Obtener todas las boletas", description = "Devuelve la lista de todas las boletas (solo ADMIN y VENDEDOR)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<BoletaDTO>> getAll() {
        List<Boleta> boletas = boletaService.obtenerTodas();
        return ResponseEntity.ok(boletaService.toDTOList(boletas));
    }

    @Operation(summary = "Obtener boleta por número", description = "Devuelve la boleta correspondiente al número especificado (solo ADMIN y VENDEDOR)")
    @GetMapping("/{numero}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<BoletaDTO> getByNumero(@PathVariable String numero) {
        return boletaService.obtenerPorNumero(numero)
                .map(boleta -> ResponseEntity.ok(boletaService.toDTO(boleta)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener boleta por pedido", description = "Devuelve la boleta correspondiente al pedido especificado (solo ADMIN y VENDEDOR)")
    @GetMapping("/pedido/{pedidoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<BoletaDTO> getByPedido(@PathVariable Long pedidoId) {
        return boletaService.obtenerPorPedidoId(pedidoId)
                .map(boleta -> ResponseEntity.ok(boletaService.toDTO(boleta)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Generar boleta para pedido", description = "Genera y devuelve la boleta para el pedido especificado (solo ADMIN y VENDEDOR)")
    @PostMapping("/generar/{pedidoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    
    public ResponseEntity<BoletaDTO> generarParaPedido(@PathVariable Long pedidoId) {
        Boleta boleta = boletaService.obtenerOCrearPorPedidoId(pedidoId);
        return ResponseEntity.ok(boletaService.toDTO(boleta));
    }
}
