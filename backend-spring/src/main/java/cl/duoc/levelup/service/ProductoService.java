package cl.duoc.levelup.service;

import cl.duoc.levelup.entity.Producto;
import cl.duoc.levelup.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Devuelve todos los productos
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // Devuelve solo los productos activos
    public List<Producto> obtenerActivos() {
        return productoRepository.findByActivoTrue();
    }

    // Busca productos por categoría
    public List<Producto> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    // Devuelve productos con stock crítico
    public List<Producto> obtenerConStockCritico() {
        return productoRepository.findProductosConStockCritico();
    }

    // Busca producto por código
        public Optional<Producto> obtenerPorId(String codigo) {
        return productoRepository.findById(codigo);
    }

    // Busca productos por nombre
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContaining(nombre);
    }

    // Crea un producto nuevo y lo deja activo
    public Producto crearProducto(Producto producto) {
        producto.setActivo(true);
        return productoRepository.save(producto);
    }

    // Actualiza los datos del producto, solo los campos con datos
        public Producto actualizarProducto(String codigo, Producto productoActualizado) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

    // Solo actualiza los campos que no son nulos
        if (productoActualizado.getNombre() != null) {
            producto.setNombre(productoActualizado.getNombre());
        }
        if (productoActualizado.getDescripcion() != null) {
            producto.setDescripcion(productoActualizado.getDescripcion());
        }
        if (productoActualizado.getPrecio() != null) {
            producto.setPrecio(productoActualizado.getPrecio());
        }
        if (productoActualizado.getStock() != null) {
            producto.setStock(productoActualizado.getStock());
        }
        if (productoActualizado.getCategoria() != null) {
            producto.setCategoria(productoActualizado.getCategoria());
        }
        if (productoActualizado.getImagen() != null) {
            producto.setImagen(productoActualizado.getImagen());
        }

        return productoRepository.save(producto);
    }

    // Marca el producto como inactivo
        public void eliminarProducto(String codigo) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // Activa el producto
        public void activarProducto(String codigo) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setActivo(true);
        productoRepository.save(producto);
    }

    // Cambia el stock del producto
        public Producto actualizarStock(String codigo, Integer nuevoStock) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setStock(nuevoStock);
        return productoRepository.save(producto);
    }

    // Verifica si hay suficiente stock y si está activo
        public boolean verificarDisponibilidad(String codigo, Integer cantidad) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        return producto.getStock() >= cantidad && producto.getActivo();
    }

    // Resta cantidad al stock si hay suficiente
        public void reducirStock(String codigo, Integer cantidad) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
        }
        
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);
    }

    // Suma cantidad al stock (por ejemplo, si se cancela un pedido)
        public void restaurarStock(String codigo, Integer cantidad) {
        Producto producto = productoRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setStock(producto.getStock() + cantidad);
        productoRepository.save(producto);
    }

    /**
     * Devuelve todas las categorías de productos que existen.
     */
    public List<String> obtenerCategorias() {
        return productoRepository.findAllCategorias();
    }
}