package cl.duoc.levelup.controller;

import cl.duoc.levelup.entity.Producto;
import cl.duoc.levelup.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import cl.duoc.levelup.dto.ActualizarStockRequest;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"*"})
@Tag(name = "Productos", description = "Gestión de productos del catálogo")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Obtener todos los productos", description = "Obtiene la lista completa de productos (requiere permisos de admin)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Producto>> getAllProducts() {
        try {
            List<Producto> productos = productoService.obtenerTodos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Obtener productos públicos", description = "Obtiene la lista de productos activos para visualización pública")
    @GetMapping("/publicos")
    public ResponseEntity<List<Producto>> getActiveProducts() {
        try {
            List<Producto> productos = productoService.obtenerActivos();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Obtener producto por código", description = "Obtiene un producto específico por su código")
    @GetMapping("/{codigo}")
    public ResponseEntity<Producto> getProductById(@PathVariable String codigo) {
        try {
            return productoService.obtenerPorId(codigo)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Obtener productos por categoría", description = "Obtiene la lista de productos filtrados por categoría")
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> getProductsByCategory(@PathVariable String categoria) {
        List<Producto> productos = productoService.obtenerPorCategoria(categoria);
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Buscar productos por nombre", description = "Busca productos por nombre")
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> searchProducts(@RequestParam String nombre) {
        List<Producto> productos = productoService.buscarPorNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Obtener todas las categorías", description = "Obtiene la lista de categorías de productos")
    @GetMapping("/categorias")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categorias = productoService.obtenerCategorias();
        return ResponseEntity.ok(categorias);
    }

    @Operation(summary = "Obtener productos con stock crítico", description = "Obtiene la lista de productos con stock crítico (solo ADMIN y VENDEDOR)")
    @GetMapping("/stock-critico")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    public ResponseEntity<List<Producto>> getCriticalStockProducts() {
        List<Producto> productos = productoService.obtenerConStockCritico();
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Crear producto", description = "Crea un nuevo producto (solo ADMIN)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> createProduct(@Valid @RequestBody Producto producto) {
        Producto nuevoProducto = productoService.crearProducto(producto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente (solo ADMIN)")
    @PutMapping("/{codigo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> updateProduct(@PathVariable String codigo, @Valid @RequestBody Producto producto) {
        Producto productoActualizado = productoService.actualizarProducto(codigo, producto);
        return ResponseEntity.ok(productoActualizado);
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto (solo ADMIN)")
    @DeleteMapping("/{codigo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable String codigo) {
        productoService.eliminarProducto(codigo);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Activar producto", description = "Activa un producto (solo ADMIN)")
    @PutMapping("/{codigo}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateProduct(@PathVariable String codigo) {
        productoService.activarProducto(codigo);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Actualizar stock de producto", description = "Actualiza el stock de un producto (solo ADMIN y VENDEDOR)")
    @PutMapping("/{codigo}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    public ResponseEntity<Producto> updateStock(@PathVariable String codigo, @RequestBody ActualizarStockRequest stockRequest) {
        Integer nuevoStock = stockRequest.getStock();
        Producto producto = productoService.actualizarStock(codigo, nuevoStock);
        return ResponseEntity.ok(producto);
    }

    @Operation(summary = "Verificar disponibilidad de producto", description = "Verifica si hay suficiente stock para una cantidad solicitada. Ejemplo de respuesta: {\n  \"disponible\": true\n}")
    @GetMapping("/{codigo}/disponibilidad")
    public ResponseEntity<cl.duoc.levelup.dto.DisponibilidadResponse> checkAvailability(@PathVariable String codigo, @RequestParam Integer cantidad) {
        boolean disponible = productoService.verificarDisponibilidad(codigo, cantidad);
        cl.duoc.levelup.dto.DisponibilidadResponse response = new cl.duoc.levelup.dto.DisponibilidadResponse(disponible);
        return ResponseEntity.ok(response);
    }
}