package cl.duoc.levelup.security;

import cl.duoc.levelup.entity.Usuario;
import cl.duoc.levelup.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        return UserPrincipal.create(usuario);
    }

    @Transactional
    public UserDetails loadUserByRun(String run) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByRun(run)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con RUN: " + run));

        return UserPrincipal.create(usuario);
    }
}