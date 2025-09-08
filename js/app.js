/* =============== UTILIDADES =============== */
function obtener(key, defecto){
  try { return JSON.parse(localStorage.getItem(key)) ?? defecto; } catch { return defecto; }
}
function guardar(key, valor){
  localStorage.setItem(key, JSON.stringify(valor));
}

/* =============== SEMILLA (primera carga) =============== */
if (!localStorage.getItem("productos") && Array.isArray(window.productosBase)) {
  guardar("productos", window.productosBase);
}
if (!localStorage.getItem("usuarios")) guardar("usuarios", []);
if (!localStorage.getItem("carrito"))  guardar("carrito", []);

/* =============== SESIÓN / NAV =============== */
function usuarioActual(){
  const sesion = obtener("sesion", null);
  if(!sesion) return null;
  const usuarios = obtener("usuarios", []);
  return usuarios.find(u => u.correo?.toLowerCase() === sesion.correo?.toLowerCase()) || null;
}
function actualizarNavegacion(){
  const u = usuarioActual();
  const linkRegistro = document.getElementById("linkRegistro");
  const linkLogin    = document.getElementById("linkLogin");
  const linkSalir    = document.getElementById("linkSalir");
  const linkAdmin    = document.getElementById("linkAdmin");

  if (linkRegistro) linkRegistro.classList.toggle("oculto", !!u);
  if (linkLogin)    linkLogin.classList.toggle("oculto", !!u);
  if (linkSalir)    linkSalir.classList.toggle("oculto", !u);
  if (linkAdmin)    linkAdmin.classList.toggle("oculto", !(u && u.tipoUsuario === "admin"));

  actualizarContadorCarrito();
}

/* =============== FORMATO =============== */
function formatoPrecio(num){
  return num.toLocaleString("es-CL",{style:"currency",currency:"CLP", maximumFractionDigits:0});
}

/* =============== DESTACADOS (INDEX) =============== */
function renderDestacados(){
  const cont = document.getElementById("gridDestacados");
  if(!cont) return;

  const prods = obtener("productos", []).slice(0,6);
  cont.innerHTML = prods.map(p=>`
    <article class="tarjeta tarjeta-producto">
      <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'">
      <div class="contenido">
        <h3>${p.nombre}</h3>
        <p class="precio">${formatoPrecio(p.precio)}</p>
        <div class="acciones">
          <a class="btn secundario" href="#ver-${encodeURIComponent(p.codigo)}">Ver</a>
          <button class="btn primario" data-agregar="${p.codigo}">Añadir</button>
        </div>
      </div>
    </article>
  `).join("");

  // Delegación: un solo listener, permanente
  if (!cont.dataset.bind) {
    cont.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-agregar]");
      if (!btn) return;
      agregarAlCarrito(btn.getAttribute("data-agregar"));
    });
    cont.dataset.bind = "1";
  }
}


/* =============== CARRITO =============== */
function obtenerCarrito(){ return obtener("carrito", []); }
function guardarCarrito(c){
  guardar("carrito", c);
  actualizarContadorCarrito();
  renderCarrito(); // no hace nada si no existe la UI del carrito
}
function agregarAlCarrito(codigo, cantidad=1){
  const prods = obtener("productos", []);
  const prod = prods.find(p=>p.codigo===codigo);
  if(!prod) return;

  const carrito = obtenerCarrito();
  const i = carrito.findIndex(it=>it.codigo===codigo);
  if(i>=0) carrito[i].cantidad += cantidad;
  else carrito.push({codigo, cantidad});

  guardarCarrito(carrito);
}
function actualizarContadorCarrito(){
  const total = obtenerCarrito().reduce((sum,it)=> sum + (Number(it.cantidad)||0), 0);
  const el = document.getElementById("contadorCarrito");
  if(el) el.textContent = total;
}
function renderCarrito(){
  // opcional: sólo si en alguna página pusieras #listaCarrito
  const cont = document.getElementById("listaCarrito");
  if(!cont) return;
  const carrito = obtenerCarrito();
  const prods = obtener("productos", []);
  let total = 0;

  cont.innerHTML = carrito.map(it=>{
    const p = prods.find(x=>x.codigo===it.codigo);
    if(!p) return "";
    const subtotal = p.precio * it.cantidad;
    total += subtotal;
    return `<div class="item-carrito">
      <div><strong>${p.nombre}</strong><br><small>${p.codigo}</small></div>
      <div>${formatoPrecio(p.precio)}</div>
      <div>x${it.cantidad}</div>
      <div>${formatoPrecio(subtotal)}</div>
    </div>`;
  }).join("");

  const totalEl = document.getElementById("totalCarrito");
  if(totalEl) totalEl.textContent = formatoPrecio(total);
}

/* =============== MENÚ LATERAL (MÓVIL) =============== */
function inicializarMenuLateral(){
  const btn = document.getElementById("btnMenu");
  const panel = document.getElementById("menuLateral");
  const cortina = document.getElementById("cortina");
  const navDesk = document.querySelector(".navegacion");
  const lista = document.getElementById("menuLista");
  if (!btn || !panel || !navDesk || !lista) return;

  // Clonar enlaces sólo una vez
  if (!lista.dataset.clonado) {
    lista.innerHTML = "";
    navDesk.querySelectorAll("a").forEach(a => {
      const nuevo = document.createElement("a");
      nuevo.href = a.getAttribute("href");
      nuevo.textContent = a.textContent.trim() || a.getAttribute("href");
      lista.appendChild(nuevo);
    });
    lista.dataset.clonado = "1";
  }

  const abrir = () => {
    document.body.classList.add("menu-abierto");
    btn.setAttribute("aria-expanded","true");
    panel.setAttribute("aria-hidden","false");
    if (cortina) cortina.hidden = false;
    const primero = lista.querySelector("a");
    if (primero) primero.focus({preventScroll:true});
  };
  const cerrar = () => {
    document.body.classList.remove("menu-abierto");
    btn.setAttribute("aria-expanded","false");
    panel.setAttribute("aria-hidden","true");
    if (cortina) cortina.hidden = true;
  };

  if (!btn.dataset.bind) {
    btn.addEventListener("click", () => {
      document.body.classList.contains("menu-abierto") ? cerrar() : abrir();
    });
    if (cortina) cortina.addEventListener("click", cerrar);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-abierto")) cerrar();
    });
    lista.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
    btn.dataset.bind = "1";
  }
}

/* =============== INICIALIZACIÓN =============== */
document.addEventListener("DOMContentLoaded", () => {
  // Nav (cambiar enlaces por sesión + contador inicial)
  actualizarNavegacion();

  // Salir de sesión (si existe el enlace)
  const linkSalir = document.getElementById("linkSalir");
  if(linkSalir){
    linkSalir.addEventListener("click", (e)=>{
      e.preventDefault();
      localStorage.removeItem("sesion");
      actualizarNavegacion();
      window.location.href = "index.html";
    });
  }

  // Index
  renderDestacados();

  // Menú móvil
  inicializarMenuLateral();
});
