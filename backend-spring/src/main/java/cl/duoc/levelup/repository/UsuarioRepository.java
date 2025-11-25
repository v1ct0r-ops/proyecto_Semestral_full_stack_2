package cl.duoc.levelup.repository;

import cl.duoc.levelup.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    
    Optional<Usuario> findByCorreo(String correo);
    
    Optional<Usuario> findByRun(String run);
    
    List<Usuario> findByTipoUsuario(Usuario.TipoUsuario tipoUsuario);
    
    List<Usuario> findByActivoTrue();
    
    @Query("SELECT u FROM Usuario u WHERE u.correo LIKE %:dominio%")
    List<Usuario> findByDominio(@Param("dominio") String dominio);
    
    @Query("SELECT u FROM Usuario u WHERE u.puntosLevelUp >= :minPuntos")
    List<Usuario> findByPuntosMinimos(@Param("minPuntos") Integer minPuntos);

    boolean existsByRun(String run);
    boolean existsByCorreo(String correo);

    void deleteByRun(String run);
}
