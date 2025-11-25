package cl.duoc.levelup.service;

import cl.duoc.levelup.dto.BoletaDTO;
import cl.duoc.levelup.entity.Boleta;
import cl.duoc.levelup.entity.Pedido;
import cl.duoc.levelup.repository.BoletaRepository;
import cl.duoc.levelup.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BoletaService {

    @Autowired
    private BoletaRepository boletaRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    // Métodos básicos para boletas

    public List<Boleta> obtenerTodas() {
        return boletaRepository.findAll();
    }

    public Optional<Boleta> obtenerPorNumero(String numero) {
        return boletaRepository.findById(numero);
    }

    public Optional<Boleta> obtenerPorPedidoId(Long pedidoId) {
        return pedidoRepository.findById(pedidoId)
                .flatMap(boletaRepository::findByPedido);
    }

    // Obtiene la boleta de un pedido, si no existe la crea
    public Boleta obtenerOCrearPorPedidoId(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + pedidoId));

        return boletaRepository.findByPedido(pedido)
                .orElseGet(() -> boletaRepository.save(new Boleta(pedido)));
    }

    // Convierte boleta a DTO

    public BoletaDTO toDTO(Boleta boleta) {
        if (boleta == null) {
            return null;
        }

        Long pedidoId = null;
        if (boleta.getPedido() != null) {
            pedidoId = boleta.getPedido().getId();
        }

        return new BoletaDTO(
                boleta.getNumero(),
                boleta.getFecha(),
                boleta.getFechaCreacion(),
                pedidoId,
                boleta.getClienteNombre(),
                boleta.getClienteCorreo(),
                boleta.getSubtotal(),
                boleta.getDescuentoDuoc(),
                boleta.getDescuentoPuntos(),
                boleta.getTotal()
        );
    }

    public List<BoletaDTO> toDTOList(List<Boleta> boletas) {
        return boletas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
