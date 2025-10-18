
// ======== Datos base ========
export const categorias = [
  "Juegos de Mesa","Accesorios","Consolas","Computadores Gamers",
  "Sillas Gamers","Mouse","Mousepad","Poleras Personalizadas","Polerones Gamers Personalizados",
  "Servivio técnico"
];

export const productosBase = [
  {codigo:"JM001", categoria:"Juegos de Mesa", nombre:"Catan", precio:29990, imagen:"https://deviramericas.com/wp-content/uploads/2013/06/Catan-basico-bodegon-web.jpg", descripcion:"Clásico de estrategia para 3-4 jugadores."},
  {codigo:"JM002", categoria:"Juegos de Mesa", nombre:"Carcassonne", precio:24990, imagen:"https://i0.wp.com/devir.mx/wp-content/uploads/2016/04/carcassonne-1200-components1.png?resize=600%2C600&ssl=1", descripcion:"Colocación de losetas, ideal 2-5 jugadores."},
  {codigo:"AC001", categoria:"Accesorios", nombre:"Control Xbox Series X", precio:59990, imagen:"https://cms-assets.xboxservices.com/assets/87/a9/87a938ce-d645-49f3-a556-10010071d936.jpg?n=Xbox-Wireless-Controller_Image-Hero-0_957848-1_1083x609_01.jpg", descripcion:"Ergonomía y respuesta táctil mejorada."},
  {codigo:"AC002", categoria:"Accesorios", nombre:"HyperX Cloud II", precio:79990, imagen:"https://row.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1737720332&width=832", descripcion:"Sonido envolvente y micrófono desmontable."},
  {codigo:"CO001", categoria:"Consolas", nombre:"PlayStation 5", precio:549990, imagen:"https://comprarmag.com/wp-content/uploads/2023/12/397848fd-3262-3f6f-fd9d-0d57c7f965d4.png", descripcion:"Nueva generación de Sony con SSD ultra rápido.", detalles:"La consola PlayStation 5 es fabricada por Sony Interactive Entertainment Inc., reconocida empresa japonesa líder en tecnología y entretenimiento. La distribución oficial se realiza a través de canales autorizados de Sony en cada región, como mayoristas y retailers certificados (ejemplo: Amazon, Best Buy, Falabella, entre otros), lo que garantiza la autenticidad del producto, soporte oficial de fábrica y el cumplimiento de estándares internacionales de calidad y seguridad. Comprar mediante distribuidores autorizados asegura que el usuario reciba un equipo nuevo, con garantía válida y sin riesgo de imitaciones o productos de procedencia dudosa."},
  {codigo:"CG001", categoria:"Computadores Gamers", nombre:"PC ASUS ROG Strix", precio:1299990, imagen:"https://dlcdnwebimgs.asus.com/files/media/8B74E7EE-B66A-4420-894E-3C3B980312EE/v1/img-webp/design/color/strix-g-2022-pink.webp", descripcion:"Alto rendimiento para juegos AAA."},
  {codigo:"SG001", categoria:"Sillas Gamers", nombre:"Secretlab Titan", precio:349990, imagen:"https://images.secretlab.co/theme/common/catalog-titanevo2022-overwatch-min-2.png", descripcion:"Ergonómica para sesiones largas."},
  {codigo:"MS001", categoria:"Mouse", nombre:"Logitech G502 HERO", precio:49990, imagen:"https://cdnx.jumpseller.com/easytech-store/image/24090186/D_NQ_NP_947437-MLC44815871328_022021-O.jpg?1652376809", descripcion:"Sensor de alta precisión y botones programables."},
  {codigo:"MP001", categoria:"Mousepad", nombre:"Razer Goliathus Extended Chroma", precio:29990, imagen:"https://m.media-amazon.com/images/I/81cLLSd5BPL._AC_SL1500_.jpg", descripcion:"Superficie amplia con iluminación RGB."},
  {codigo:"PP001", categoria:"Poleras Personalizadas", nombre:"Polera 'Level-Up'", precio:14990, imagen:"https://www.gustore.cl/img/estampados/8305/8305_1.png", descripcion:"Personalizable con tu gamer tag."}
];


// Regiones y comunas 
export const regiones = [
  { nombre: "Región Metropolitana", comunas: ["El Bosque", "San Bernardo", "Santiago","Providencia","Las Condes","Maipú","Puente Alto"] },
  { nombre: "Valparaíso", comunas: ["Valparaíso","Viña del Mar","Quilpué","Villa Alemana"] },
  { nombre: "Biobío", comunas: ["Concepción","Talcahuano","Chiguayante","San Pedro de la Paz"] }
];
