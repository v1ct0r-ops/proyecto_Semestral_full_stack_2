package cl.duoc.levelup.service;

import cl.duoc.levelup.dto.SolicitudContactoRequest;
import cl.duoc.levelup.entity.Solicitud;
import cl.duoc.levelup.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    public Solicitud crearSolicitud(SolicitudContactoRequest request) {
        Solicitud s = new Solicitud();
        s.setNombre(request.getNombre());
        s.setCorreo(request.getCorreo());
        s.setDescripcion(request.getDescripcion());
        s.setFecha(LocalDateTime.now());
    s.setEstado("pendiente"); // Estado inicial de la solicitud
        return solicitudRepository.save(s);
    }

    public List<Solicitud> obtenerTodas() {
    // Devuelve todas las solicitudes
        return solicitudRepository.findAll();
    }

    public Solicitud obtenerPorId(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public List<Solicitud> obtenerPorEstado(String estado) {
        return solicitudRepository.findByEstado(estado.toLowerCase());
    }

    public Solicitud actualizarEstado(Long id, String nuevoEstado) {
        Solicitud s = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        s.setEstado(nuevoEstado.toLowerCase());
        return solicitudRepository.save(s);
    }

    public void eliminar(Long id) {
        solicitudRepository.deleteById(id);
    }
}
