package cl.duoc.levelup.config;

import cl.duoc.levelup.entity.Producto;
import cl.duoc.levelup.entity.Usuario;
import cl.duoc.levelup.repository.ProductoRepository;
import cl.duoc.levelup.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Profile("!prod")  // Solo se ejecuta en desarrollo, no en producción
public class DataInitializer {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        initializeUsers();
        initializeProducts();
    }

    private void initializeUsers() {
        // Si ya existen usuarios, no inicializar de nuevo
        if (usuarioRepository.count() > 0) {
            return;
        }

        // Inicializando usuarios por defecto

        // Usuario Administrador
        Usuario admin = new Usuario();
        admin.setRun("12345678-9");
        admin.setNombres("Administrador");
        admin.setApellidos("Sistema");
        admin.setCorreo("admin@levelup.cl");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setTipoUsuario(Usuario.TipoUsuario.ADMIN);
        admin.setRegion("Metropolitana");
        admin.setComuna("Santiago");
        admin.setDireccion("Av. Principal 123");
        admin.setFechaRegistro(LocalDateTime.now());
        admin.setActivo(true);
        admin.setPuntosLevelUp(0);
        usuarioRepository.save(admin);

        // Usuario Vendedor
        Usuario vendedor = new Usuario();
        vendedor.setRun("98765432-1");
        vendedor.setNombres("Juan Carlos");
        vendedor.setApellidos("Vendedor");
        vendedor.setCorreo("vendedor@levelup.cl");
        vendedor.setPassword(passwordEncoder.encode("vendedor123"));
        vendedor.setTipoUsuario(Usuario.TipoUsuario.VENDEDOR);
        vendedor.setRegion("Metropolitana");
        vendedor.setComuna("Las Condes");
        vendedor.setDireccion("Av. Apoquindo 456");
        vendedor.setFechaRegistro(LocalDateTime.now());
        vendedor.setActivo(true);
        vendedor.setPuntosLevelUp(0);
        usuarioRepository.save(vendedor);

        // Usuario Cliente DUOC
        Usuario clienteDuoc = new Usuario();
        clienteDuoc.setRun("11111111-1");
        clienteDuoc.setNombres("María José");
        clienteDuoc.setApellidos("Estudiante DUOC");
        clienteDuoc.setCorreo("maria.estudiante@duocuc.cl");
        clienteDuoc.setPassword(passwordEncoder.encode("duoc123"));
        clienteDuoc.setTipoUsuario(Usuario.TipoUsuario.CLIENTE);
        clienteDuoc.setRegion("Metropolitana");
        clienteDuoc.setComuna("Maipú");
        clienteDuoc.setDireccion("Av. Bernardo O'Higgins 789");
        clienteDuoc.setFechaRegistro(LocalDateTime.now());
        clienteDuoc.setActivo(true);
        clienteDuoc.setPuntosLevelUp(150); // Cliente con puntos
        usuarioRepository.save(clienteDuoc);

        // Usuario Cliente Normal
        Usuario clienteNormal = new Usuario();
        clienteNormal.setRun("22222222-2");
        clienteNormal.setNombres("Pedro Antonio");
        clienteNormal.setApellidos("Cliente Normal");
        clienteNormal.setCorreo("pedro.cliente@gmail.com");
        clienteNormal.setPassword(passwordEncoder.encode("cliente123"));
        clienteNormal.setTipoUsuario(Usuario.TipoUsuario.CLIENTE);
        clienteNormal.setRegion("Valparaíso");
        clienteNormal.setComuna("Viña del Mar");
        clienteNormal.setDireccion("Calle Falsa 321");
        clienteNormal.setFechaRegistro(LocalDateTime.now());
        clienteNormal.setActivo(true);
        clienteNormal.setPuntosLevelUp(50);
        usuarioRepository.save(clienteNormal);

        // Usuario Richard (para pruebas)
        Usuario richard = new Usuario();
        richard.setRun("33333333-3");
        richard.setNombres("Richard");
        richard.setApellidos("Moreano");
        richard.setCorreo("richard@duoc.cl");
        richard.setPassword(passwordEncoder.encode("admin123")); // Password para pruebas
        richard.setTipoUsuario(Usuario.TipoUsuario.ADMIN);
        richard.setRegion("Metropolitana");
        richard.setComuna("Santiago");
        richard.setDireccion("Campus Duoc UC");
        richard.setFechaRegistro(LocalDateTime.now());
        richard.setActivo(true);
        richard.setPuntosLevelUp(0);
        usuarioRepository.save(richard);
        
        // Usuario para pruebas con el correo que intentas usar
        Usuario ri = new Usuario();
        ri.setRun("44444444-4");
        ri.setNombres("Ricardo");
        ri.setApellidos("Testing");
        ri.setCorreo("ri@duoc.cl");
        ri.setPassword(passwordEncoder.encode("123456")); // Password para pruebas
        ri.setTipoUsuario(Usuario.TipoUsuario.CLIENTE);
        ri.setRegion("Metropolitana");
        ri.setComuna("Santiago");
        ri.setDireccion("Campus Duoc UC");
        ri.setFechaRegistro(LocalDateTime.now());
        ri.setActivo(true);
        ri.setPuntosLevelUp(100);
        usuarioRepository.save(ri);

    // Usuarios inicializados correctamente
    }

    private void initializeProducts() {
        // Si ya existen productos, no inicializar de nuevo
        if (productoRepository.count() > 0) {
            return;
        }

        // Inicializando productos por defecto

        // Producto 1: Catan
        Producto catan = new Producto();
        catan.setCodigo("JM001");
        catan.setNombre("Catan");
        catan.setCategoria("Juegos de Mesa");
        catan.setDescripcion("Clásico de estrategia para 3-4 jugadores.");
        catan.setPrecio(new BigDecimal("29990"));
        catan.setStock(15);
        catan.setStockCritico(5);
        catan.setImagen("https://deviramericas.com/wp-content/uploads/2013/06/Catan-basico-bodegon-web.jpg");
        catan.setActivo(true);
        productoRepository.save(catan);

        // Producto 2: Carcassonne
        Producto carcassonne = new Producto();
        carcassonne.setCodigo("JM002");
        carcassonne.setNombre("Carcassonne");
        carcassonne.setCategoria("Juegos de Mesa");
        carcassonne.setDescripcion("Colocación de losetas, ideal 2-5 jugadores.");
        carcassonne.setPrecio(new BigDecimal("24990"));
        carcassonne.setStock(12);
        carcassonne.setStockCritico(4);
        carcassonne.setImagen("https://i0.wp.com/devir.mx/wp-content/uploads/2016/04/carcassonne-1200-components1.png?resize=600%2C600&ssl=1");
        carcassonne.setActivo(true);
        productoRepository.save(carcassonne);

        // Producto 3: Control Xbox Series X
        Producto controlXbox = new Producto();
        controlXbox.setCodigo("AC001");
        controlXbox.setNombre("Control Xbox Series X");
        controlXbox.setCategoria("Accesorios");
        controlXbox.setDescripcion("Ergonomía y respuesta táctil mejorada.");
        controlXbox.setPrecio(new BigDecimal("59990"));
        controlXbox.setStock(25);
        controlXbox.setStockCritico(8);
        controlXbox.setImagen("https://cms-assets.xboxservices.com/assets/87/a9/87a938ce-d645-49f3-a556-10010071d936.jpg?n=Xbox-Wireless-Controller_Image-Hero-0_957848-1_1083x609_01.jpg");
        controlXbox.setActivo(true);
        productoRepository.save(controlXbox);

        // Producto 4: HyperX Cloud II
        Producto hyperxCloud = new Producto();
        hyperxCloud.setCodigo("AC002");
        hyperxCloud.setNombre("HyperX Cloud II");
        hyperxCloud.setCategoria("Accesorios");
        hyperxCloud.setDescripcion("Sonido envolvente y micrófono desmontable.");
        hyperxCloud.setPrecio(new BigDecimal("79990"));
        hyperxCloud.setStock(18);
        hyperxCloud.setStockCritico(6);
        hyperxCloud.setImagen("https://row.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1737720332&width=832");
        hyperxCloud.setActivo(true);
        productoRepository.save(hyperxCloud);

        // Producto 5: PlayStation 5
        Producto ps5 = new Producto();
        ps5.setCodigo("CO001");
        ps5.setNombre("PlayStation 5");
        ps5.setCategoria("Consolas");
        ps5.setDescripcion("Nueva generación de Sony con SSD ultra rápido.");
        ps5.setPrecio(new BigDecimal("549990"));
        ps5.setStock(8);
        ps5.setStockCritico(3);
        ps5.setImagen("https://comprarmag.com/wp-content/uploads/2023/12/397848fd-3262-3f6f-fd9d-0d57c7f965d4.png");
        ps5.setActivo(true);
        productoRepository.save(ps5);

        // Producto 6: PC ASUS ROG Strix
        Producto pcAsus = new Producto();
        pcAsus.setCodigo("CG001");
        pcAsus.setNombre("PC ASUS ROG Strix");
        pcAsus.setCategoria("Computadores Gamers");
        pcAsus.setDescripcion("Alto rendimiento para juegos AAA.");
        pcAsus.setPrecio(new BigDecimal("1299990"));
        pcAsus.setStock(5);
        pcAsus.setStockCritico(2);
        pcAsus.setImagen("https://dlcdnwebimgs.asus.com/files/media/8B74E7EE-B66A-4420-894E-3C3B980312EE/v1/img-webp/design/color/strix-g-2022-pink.webp");
        pcAsus.setActivo(true);
        productoRepository.save(pcAsus);

        // Producto 7: Secretlab Titan
        Producto secretlabTitan = new Producto();
        secretlabTitan.setCodigo("SG001");
        secretlabTitan.setNombre("Secretlab Titan");
        secretlabTitan.setCategoria("Sillas Gamers");
        secretlabTitan.setDescripcion("Ergonómica para sesiones largas.");
        secretlabTitan.setPrecio(new BigDecimal("349990"));
        secretlabTitan.setStock(10);
        secretlabTitan.setStockCritico(4);
        secretlabTitan.setImagen("https://images.secretlab.co/theme/common/catalog-titanevo2022-overwatch-min-2.png");
        secretlabTitan.setActivo(true);
        productoRepository.save(secretlabTitan);

        // Producto 8: Logitech G502 HERO
        Producto logitechMouse = new Producto();
        logitechMouse.setCodigo("MS001");
        logitechMouse.setNombre("Logitech G502 HERO");
        logitechMouse.setCategoria("Mouse");
        logitechMouse.setDescripcion("Sensor de alta precisión y botones programables.");
        logitechMouse.setPrecio(new BigDecimal("49990"));
        logitechMouse.setStock(30);
        logitechMouse.setStockCritico(10);
        logitechMouse.setImagen("https://cdnx.jumpseller.com/easytech-store/image/24090186/D_NQ_NP_947437-MLC44815871328_022021-O.jpg?1652376809");
        logitechMouse.setActivo(true);
        productoRepository.save(logitechMouse);

        // Producto 9: Razer Goliathus Extended Chroma
        Producto razerMousepad = new Producto();
        razerMousepad.setCodigo("MP001");
        razerMousepad.setNombre("Razer Goliathus Extended Chroma");
        razerMousepad.setCategoria("Mousepad");
        razerMousepad.setDescripcion("Superficie amplia con iluminación RGB.");
        razerMousepad.setPrecio(new BigDecimal("29990"));
        razerMousepad.setStock(20);
        razerMousepad.setStockCritico(7);
        razerMousepad.setImagen("https://m.media-amazon.com/images/I/81cLLSd5BPL._AC_SL1500_.jpg");
        razerMousepad.setActivo(true);
        productoRepository.save(razerMousepad);

        // Producto 10: Polera 'Level-Up'
        Producto poleraLevelUp = new Producto();
        poleraLevelUp.setCodigo("PP001");
        poleraLevelUp.setNombre("Polera 'Level-Up'");
        poleraLevelUp.setCategoria("Poleras Personalizadas");
        poleraLevelUp.setDescripcion("Personalizable con tu gamer tag.");
        poleraLevelUp.setPrecio(new BigDecimal("14990"));
        poleraLevelUp.setStock(1); // Stock crítico para testing
        poleraLevelUp.setStockCritico(5);
        poleraLevelUp.setImagen("https://www.gustore.cl/img/estampados/8305/8305_1.png");
        poleraLevelUp.setActivo(true);
        productoRepository.save(poleraLevelUp);

    // Productos inicializados correctamente
    }
}