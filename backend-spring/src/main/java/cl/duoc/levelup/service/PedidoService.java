package cl.duoc.levelup.service;

import cl.duoc.levelup.entity.*;
import cl.duoc.levelup.dto.CrearPedidoRequest;
import cl.duoc.levelup.dto.ItemPedidoRequest;
import cl.duoc.levelup.repository.PedidoRepository;
import cl.duoc.levelup.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoService productoService;

    public Pedido crearPedido(UserPrincipal userPrincipal, CrearPedidoRequest request) {
        Usuario usuario = usuarioService.obtenerUsuarioAutenticado(userPrincipal);
        
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setDireccion(request.getDireccion());
        pedido.setRegion(request.getRegion());
        pedido.setComuna(request.getComuna());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        
    // Inicializa la lista de items del pedido
        pedido.setItems(new ArrayList<>());
        
        // Procesar items del pedido
        BigDecimal subtotal = BigDecimal.ZERO;
        
    for (ItemPedidoRequest itemRequest : request.getItems()) {
            // Verificar disponibilidad
            if (!productoService.verificarDisponibilidad(itemRequest.getProductoCodigo(), itemRequest.getCantidad())) {
                throw new RuntimeException("Producto " + itemRequest.getProductoCodigo() + " no disponible");
            }
            
            Producto producto = productoService.obtenerPorId(itemRequest.getProductoCodigo())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            PedidoItem item = new PedidoItem();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemRequest.getCantidad());
            item.setPrecio(producto.getPrecio());
            
            pedido.getItems().add(item);
            subtotal = subtotal.add(producto.getPrecio().multiply(BigDecimal.valueOf(itemRequest.getCantidad())));
            
            // Reducir stock
            productoService.reducirStock(itemRequest.getProductoCodigo(), itemRequest.getCantidad());
        }
        
        // Aplicar descuentos y calcular totales
        pedido.setSubtotal(subtotal);
        pedido.calcularTotales(); // Usa la lógica de descuentos de la entidad
        
        // Aplicar puntos LevelUp si se especifican
        if (request.getPuntosAUsar() != null && request.getPuntosAUsar() > 0) {
            usuarioService.usarPuntos(usuario.getRun(), request.getPuntosAUsar());
            BigDecimal descuentoPuntos = BigDecimal.valueOf(request.getPuntosAUsar() * 10); // 1 punto = $10
            pedido.setTotal(pedido.getTotal().subtract(descuentoPuntos));
        }
        
        // Otorgar puntos por la compra (1% del total)
        Integer puntosGanados = pedido.getTotal().intValue() / 100;
        if (puntosGanados > 0) {
            usuarioService.agregarPuntos(usuario.getRun(), puntosGanados);
        }
        
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> obtenerPedidosUsuario(String runUsuario) {
        return pedidoRepository.findByUsuarioRun(runUsuario);
    }

    public List<Pedido> obtenerTodosPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido actualizarEstado(Long pedidoId, Pedido.EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public void cancelarPedido(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        if (pedido.getEstado() != Pedido.EstadoPedido.PENDIENTE) {
            throw new RuntimeException("Solo se pueden cancelar pedidos pendientes");
        }
        
        // Restaurar stock
        for (PedidoItem item : pedido.getItems()) {
            productoService.restaurarStock(item.getProducto().getCodigo(), item.getCantidad());
        }
        
        pedido.setEstado(Pedido.EstadoPedido.CANCELADO);
        pedidoRepository.save(pedido);
    }

    // DTOs eliminados, ahora se usan los del paquete dto
}