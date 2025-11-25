package cl.duoc.levelup.service;

import cl.duoc.levelup.entity.Usuario;
import cl.duoc.levelup.repository.UsuarioRepository;
import cl.duoc.levelup.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Crea un usuario nuevo, revisa correo y encripta la contraseña
    public Usuario crearUsuario(Usuario usuario) {
    // Si el correo ya existe, lanza error
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con este correo");
        }

    // Encripta la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

    // Inicializa el usuario como activo y con puntos en cero
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setPuntosLevelUp(0);

        return usuarioRepository.save(usuario);
    }

    // Busca usuario por RUN
    public Optional<Usuario> obtenerPorRun(String run) {
        return usuarioRepository.findByRun(run);
    }

    // Busca usuario por correo
    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    // Devuelve todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Devuelve solo los usuarios activos
    public List<Usuario> obtenerActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    // Busca usuarios por tipo
    public List<Usuario> obtenerPorTipo(Usuario.TipoUsuario tipo) {
        return usuarioRepository.findByTipoUsuario(tipo);
    }

    // Actualiza los datos del usuario, menos la contraseña
    public Usuario actualizarUsuario(String run, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // Solo actualiza los campos que no son nulos
        if (usuarioActualizado.getNombres() != null) {
            usuario.setNombres(usuarioActualizado.getNombres());
        }
        if (usuarioActualizado.getApellidos() != null) {
            usuario.setApellidos(usuarioActualizado.getApellidos());
        }
        if (usuarioActualizado.getDireccion() != null) {
            usuario.setDireccion(usuarioActualizado.getDireccion());
        }
        if (usuarioActualizado.getRegion() != null) {
            usuario.setRegion(usuarioActualizado.getRegion());
        }
        if (usuarioActualizado.getComuna() != null) {
            usuario.setComuna(usuarioActualizado.getComuna());
        }
        if (usuarioActualizado.getCorreo() != null) {
            usuario.setCorreo(usuarioActualizado.getCorreo());
        }
        if (usuarioActualizado.getTipoUsuario() != null) {
            usuario.setTipoUsuario(usuarioActualizado.getTipoUsuario());
        }

    // La contraseña se cambia solo con el método especial

        return usuarioRepository.save(usuario);
    }

    // Desactiva el usuario
    public void desactivarUsuario(String run) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    // Activa el usuario
    public void activarUsuario(String run) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }

    // Suma puntos al usuario
    public Usuario agregarPuntos(String run, Integer puntos) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setPuntosLevelUp(usuario.getPuntosLevelUp() + puntos);
        return usuarioRepository.save(usuario);
    }

    // Resta puntos al usuario si tiene suficientes
    public Usuario usarPuntos(String run, Integer puntos) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getPuntosLevelUp() < puntos) {
            throw new RuntimeException("No tienes suficientes puntos LevelUp");
        }

        usuario.setPuntosLevelUp(usuario.getPuntosLevelUp() - puntos);
        return usuarioRepository.save(usuario);
    }

    // Busca usuarios por dominio de correo
    public List<Usuario> obtenerPorDominio(String dominio) {
        return usuarioRepository.findByDominio(dominio);
    }

    // Devuelve usuarios con mínimo de puntos
    public List<Usuario> obtenerConPuntosMinimos(Integer minPuntos) {
        return usuarioRepository.findByPuntosMinimos(minPuntos);
    }

    // Cambia la contraseña si la actual es correcta
    public boolean cambiarPassword(String run, String passwordActual, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // Verifica que la contraseña actual sea correcta
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            return false;
        }

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        return true;
    }

    // Devuelve el usuario autenticado
    public Usuario obtenerUsuarioAutenticado(UserPrincipal userPrincipal) {
        return usuarioRepository.findByRun(userPrincipal.getRun())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }
}
