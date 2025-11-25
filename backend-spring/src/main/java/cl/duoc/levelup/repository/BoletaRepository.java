package cl.duoc.levelup.repository;

import cl.duoc.levelup.entity.Boleta;
import cl.duoc.levelup.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BoletaRepository extends JpaRepository<Boleta, String> {
    
    Optional<Boleta> findByPedido(Pedido pedido);
    
    List<Boleta> findByFechaOrderByFechaCreacionDesc(LocalDate fecha);
    
    @Query("SELECT b FROM Boleta b WHERE b.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY b.fechaCreacion DESC")
    List<Boleta> findByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, 
                                   @Param("fechaFin") LocalDate fechaFin);
    
    @Query("SELECT b FROM Boleta b WHERE b.clienteCorreo = :correo ORDER BY b.fechaCreacion DESC")
    List<Boleta> findByClienteCorreo(@Param("correo") String correo);
    
    boolean existsByPedido(Pedido pedido);
}