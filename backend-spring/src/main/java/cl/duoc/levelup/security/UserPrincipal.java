package cl.duoc.levelup.security;

import cl.duoc.levelup.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    private String run;
    private String correo;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(String run, String correo, String password, Collection<? extends GrantedAuthority> authorities) {
        this.run = run;
        this.correo = correo;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(Usuario usuario) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario().name());
        
        return new UserPrincipal(
                usuario.getRun(),
                usuario.getCorreo(),
                usuario.getPassword(),
                Collections.singletonList(authority)
        );
    }

    public String getRun() {
        return run;
    }

    @Override
    public String getUsername() {
        return correo;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}