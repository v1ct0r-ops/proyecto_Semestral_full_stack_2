package cl.duoc.levelup.repository;

import cl.duoc.levelup.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, String> {
    
    List<Producto> findByCategoria(String categoria);
    
    List<Producto> findByActivoTrue();
    
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockCritico AND p.activo = true")
    List<Producto> findProductosConStockCritico();
    
    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE %:nombre% AND p.activo = true")
    List<Producto> findByNombreContaining(@Param("nombre") String nombre);
    
    @Query("SELECT p FROM Producto p WHERE p.precio BETWEEN :min AND :max AND p.activo = true")
    List<Producto> findByPrecioBetween(@Param("min") BigDecimal min, @Param("max") BigDecimal max);
    
    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.activo = true ORDER BY p.categoria")
    List<String> findAllCategorias();
}