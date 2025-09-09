/* =============== UTILIDADES =============== */
function obtener(key, defecto){
  try { return JSON.parse(localStorage.getItem(key)) ?? defecto; } catch { return defecto; }
}
function guardar(key, valor){
  localStorage.setItem(key, JSON.stringify(valor));
}
function esAdmin(){ 
  const u=usuarioActual(); return !!(u && u.tipoUsuario==="admin"); }
function esVendedor(){ 
  const u=usuarioActual(); return !!(u && u.tipoUsuario==="vendedor"); }

/* =============== Primera carga =============== */
if (!localStorage.getItem("productos") && Array.isArray(productosBase)) {
  guardar("productos", productosBase);
}
if (!localStorage.getItem("usuarios")) guardar("usuarios", []);
if (!localStorage.getItem("carrito"))  guardar("carrito", []);

/* LOGIN Y REGISTRO */

/* =============== REGISTRO: regiones/comunas + submit =============== */
function inicializarRegistro(){
  const form = document.getElementById("formRegistro");
  if (!form) return; 

  // Regiones/comunas
  const selRegion = document.getElementById("region");
  const selComuna = document.getElementById("comuna");

  if (selRegion && selComuna) {
    if (typeof regiones === "undefined" || !Array.isArray(regiones)) {
      console.warn("No se encontró 'regiones'. Asegúrate de cargar datos.js antes de app.js.");
    } else {
      selRegion.innerHTML = regiones.map(r => `<option>${r.nombre}</option>`).join("");
      const actualizarComunas = () => {
        const r = regiones.find(x => x.nombre === selRegion.value);
        selComuna.innerHTML = (r?.comunas || []).map(c => `<option>${c}</option>`).join("");
      };
      selRegion.addEventListener("change", actualizarComunas);
      actualizarComunas();
    }
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const run             = document.getElementById("run").value.trim();
    const nombres         = document.getElementById("nombres").value.trim();
    const apellidos       = document.getElementById("apellidos").value.trim();
    const correo          = document.getElementById("correo").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const tipoUsuario     = document.getElementById("tipoUsuario").value;
    const region          = document.getElementById("region")?.value || "";
    const comuna          = document.getElementById("comuna")?.value || "";
    const direccion       = document.getElementById("direccion").value.trim();
    const pass            = document.getElementById("password").value;
    const pass2           = document.getElementById("password2").value;
    const referido        = document.getElementById("referido")?.value.trim() || "";

    // limpiar errores
    ["errRun","errNombres","errApellidos","errCorreo","errFecha","errTipo","errRegion","errComuna","errDireccion","errPass","errPass2","msgRegistro"]
      .forEach(id=>{ const el = document.getElementById(id); if (el) el.textContent = ""; });

    let ok = true;
    if(!validarRun(run))                           { document.getElementById("errRun").textContent = "RUN inválido."; ok=false; }
    if(!nombres)                                   { document.getElementById("errNombres").textContent = "Requerido."; ok=false; }
    if(!apellidos)                                 { document.getElementById("errApellidos").textContent = "Requerido."; ok=false; }
    if(!esCorreoPermitido(correo) || correo.length>100){
                                                     document.getElementById("errCorreo").textContent = "Correo no permitido o supera 100 caracteres."; ok=false;
                                                   }
    if(!esMayorDe18(fechaNacimiento))              { document.getElementById("errFecha").textContent = "Debés ser mayor de 18 años."; ok=false; }
    if(!tipoUsuario)                               { document.getElementById("errTipo").textContent = "Seleccioná un tipo."; ok=false; }
    if(selRegion && !region)                       { document.getElementById("errRegion").textContent = "Seleccioná una región."; ok=false; }
    if(selComuna && !comuna)                       { document.getElementById("errComuna").textContent = "Seleccioná una comuna."; ok=false; }
    if(!direccion || direccion.length>300)         { document.getElementById("errDireccion").textContent = "Dirección requerida (máx 300)."; ok=false; }
    if(pass.length<4 || pass.length>10)            { document.getElementById("errPass").textContent = "Contraseña 4 a 10 caracteres."; ok=false; }
    if(pass!==pass2)                               { document.getElementById("errPass2").textContent = "Las contraseñas no coinciden."; ok=false; }

    const usuarios = obtener("usuarios", []);
    if(usuarios.some(u => u.correo.toLowerCase()===correo.toLowerCase())){
      document.getElementById("errCorreo").textContent = "El correo ya existe."; ok=false;
    }
    if(usuarios.some(u => u.run.toUpperCase()===run.toUpperCase())){
      document.getElementById("errRun").textContent = "El RUN ya existe."; ok=false;
    }
    if(!ok) return;

    // Referidos
    if (referido){
      const refUser = usuarios.find(u => (u.codigoReferido||"").toLowerCase() === referido.toLowerCase());
      if (refUser){
        refUser.puntosLevelUp = (refUser.puntosLevelUp||0) + 50;
      }
    }
    const codigoReferido = "REF" + Math.random().toString(36).substring(2,8).toUpperCase();
    const descuentoDuoc  = correo.toLowerCase().endsWith("@duoc.cl");

    const nuevo = { run, nombres, apellidos, correo, fechaNacimiento, tipoUsuario, region, comuna, direccion,
                    pass, descuentoDuoc, puntosLevelUp:0, codigoReferido, compras:[] };
    usuarios.push(nuevo);
    guardar("usuarios", usuarios);

    const msg = document.getElementById("msgRegistro");
    if (msg) msg.textContent = "¡Cuenta creada! Ahora podés ingresar.";
    form.reset();
  });
}

/* =============== VALIDACIONES (registro.html) =============== */
const dominiosPermitidos = ["duoc.cl","profesor.duoc.cl","gmail.com"];
function esCorreoPermitido(correo){
  const m = (correo||"").toLowerCase().match(/^[\w.+-]+@([\w.-]+)$/);
  if(!m) return false;
  const dominio = m[1];
  return dominiosPermitidos.some(d => dominio.endsWith(d));
}
function validarRun(run){
  const limpio = (run||"").toUpperCase().replace(/\.|-/g,"");
  if(limpio.length < 7 || limpio.length > 9) return false;
  const cuerpo = limpio.slice(0,-1);
  const dv = limpio.slice(-1);
  let suma = 0, multiplo = 2;
  for(let i=cuerpo.length-1;i>=0;i--){
    suma += parseInt(cuerpo[i],10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo+1;
  }
  const resto = 11 - (suma % 11);
  const dvCalc = resto === 11 ? "0" : (resto === 10 ? "K" : String(resto));
  return dv === dvCalc;
}
function esMayorDe18(fechaStr){
  const n = new Date(fechaStr);
  if(isNaN(n)) return false;
  const hoy = new Date();
  let edad = hoy.getFullYear()-n.getFullYear();
  const m = hoy.getMonth()-n.getMonth();
  if(m<0 || (m===0 && hoy.getDate()<n.getDate())) edad--;
  return edad >= 18;
}


/* =============== LOGIN =============== */
function inicializarLogin(){
  const form = document.getElementById("formLogin");
  if (!form) return; // no estás en login.html

  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const correo = document.getElementById("correoLogin").value.trim();
    const pass   = document.getElementById("passwordLogin").value;

    const errCorreo = document.getElementById("errCorreoLogin");
    const errPass   = document.getElementById("errPassLogin");
    const msg       = document.getElementById("msgLogin");
    if (errCorreo) errCorreo.textContent = "";
    if (errPass)   errPass.textContent   = "";
    if (msg)       msg.textContent       = "";

    if(!esCorreoPermitido(correo) || correo.length>100){
      if (errCorreo) errCorreo.textContent = "Correo inválido.";
      return;
    }
    if(pass.length<4 || pass.length>10){
      if (errPass) errPass.textContent = "Contraseña 4 a 10 caracteres.";
      return;
    }

    const usuarios = obtener("usuarios", []);
    const u = usuarios.find(x=>x.correo.toLowerCase()===correo.toLowerCase());
    if(!u){ if (errCorreo) errCorreo.textContent = "No existe el usuario."; return; }
    if(u.pass !== pass){ if (errPass) errPass.textContent = "Contraseña incorrecta."; return; }

    guardar("sesion", {correo:u.correo, tipo:u.tipoUsuario});
    if (msg) msg.textContent = "¡Bienvenido/a, " + (u.nombres||"") + "! Redirigiendo…";
    setTimeout(()=>{ window.location.href = "productos.html"; }, 700);
  });
}


/* =============== SESIÓN / NAV =============== */
function usuarioActual(){
  const sesion = obtener("sesion", null);
  if(!sesion) return null;
  const usuarios = obtener("usuarios", []);
  return usuarios.find(u => u.correo?.toLowerCase() === sesion.correo?.toLowerCase()) || null;
}
function actualizarNavegacion(){
  const u = usuarioActual();
  const linkRegistro  = document.getElementById("linkRegistro");
  const linkLogin     = document.getElementById("linkLogin");
  const linkSalir     = document.getElementById("linkSalir");
  const linkAdmin     = document.getElementById("linkAdmin");
  const linkVendedor  = document.getElementById("linkVendedor");
  const linkMiCuenta  = document.getElementById("linkMiCuenta");
  const btnPerfilDesk = document.getElementById("btnPerfilDesk");

  if (linkRegistro)  linkRegistro.classList.toggle("oculto", !!u);
  if (linkLogin)     linkLogin.classList.toggle("oculto", !!u);
  if (linkSalir)     linkSalir.classList.toggle("oculto", !u);

  if (linkAdmin)     linkAdmin.classList.toggle("oculto", !(u && u.tipoUsuario === "admin"));
  if (linkVendedor)  linkVendedor.classList.toggle("oculto", !(u && u.tipoUsuario === "vendedor")); 

  if (linkMiCuenta)  linkMiCuenta.classList.toggle("oculto", !u);
  if (btnPerfilDesk) btnPerfilDesk.classList.toggle("oculto", !u);

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
          <a class="btn secundario" href="producto.html?codigo=${encodeURIComponent(p.codigo)}">Ver</a>
          <button class="btn primario" data-agregar="${p.codigo}">Añadir</button>
        </div>
      </div>
    </article>
  `).join("");

  // Delegación: un solo listener permanente
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
function guardarCarrito(c){ guardar("carrito", c); actualizarContadorCarrito(); renderCarrito(); }
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
function quitarDelCarrito(codigo){
  guardarCarrito(obtenerCarrito().filter(it=>it.codigo!==codigo));
}
function cambiarCantidad(codigo, nuevaCant){
  const c = obtenerCarrito();
  const i = c.findIndex(it=>it.codigo===codigo);
  if(i>=0){ c[i].cantidad = Math.max(1, parseInt(nuevaCant||"1",10)); }
  guardarCarrito(c);
}
function renderCarrito(){
  const cont = document.getElementById("listaCarrito");
  if(!cont) return;
  const carrito = obtenerCarrito();
  const prods = obtener("productos", []);
  let total = 0, totalSinDesc = 0;
  cont.innerHTML = carrito.map(it=>{
    const p = prods.find(x=>x.codigo===it.codigo);
    if(!p) return "";
    const precio = precioConDescuento(p.precio);
    total += precio * it.cantidad;
    totalSinDesc += p.precio * it.cantidad;
    return `<div class="item-carrito">
      <div><strong>${p.nombre}</strong><br><small>${p.codigo}</small></div>
      <div>${formatoPrecio(precio)}</div>
      <div>
        <input type="number" min="1" value="${it.cantidad}" onchange="cambiarCantidad('${p.codigo}', this.value)">
        <button class="btn secundario" onclick="quitarDelCarrito('${p.codigo}')">Quitar</button>
      </div>
    </div>`;
  }).join("");

  const u = usuarioActual();
  if(document.getElementById("textoDescuento")){
    const hayDuoc = !!(u && u.correo?.toLowerCase().endsWith("@duoc.cl"));
    document.getElementById("textoDescuento").classList.toggle("oculto", !(hayDuoc && totalSinDesc>total));
    if(hayDuoc) document.getElementById("montoDescuento").textContent = "- " + formatoPrecio(totalSinDesc-total);
  }
  const totalEl = document.getElementById("totalCarrito");
  if(totalEl) totalEl.textContent = formatoPrecio(total);
}
function actualizarContadorCarrito(){
  const total = obtenerCarrito().reduce((sum,it)=> sum + (Number(it.cantidad)||0), 0);
  const el = document.getElementById("contadorCarrito");
  if(el) el.textContent = total;
}

/* PANELES */

/* =============== MENÚ LATERAL (MOVIL) =============== */
function inicializarMenuLateral(){
  const btn = document.getElementById("btnMenu");
  const panel = document.getElementById("menuLateral");
  const cortina = document.getElementById("cortina");
  const navDesk = document.querySelector(".navegacion");
  const lista = document.getElementById("menuLista");
  if (!btn || !panel || !navDesk || !lista) return;

  // reconstruir solo una vez
  if (!lista.dataset.clonado) {
    lista.innerHTML = "";

    // 1) Si hay usuario, agregamos primero "Mi cuenta" y "Salir" (solo móvil)
    const u = usuarioActual();
    if (u) {
      const miCuenta = document.createElement("a");
      miCuenta.href = "#";
      miCuenta.id = "linkMiCuentaMov";
      miCuenta.textContent = "Mi cuenta";
      lista.appendChild(miCuenta);

    }

    // 2) Clonamos los enlaces del nav de escritorio (sin IDs)
    navDesk.querySelectorAll("a").forEach(a => {
      if (a.classList.contains("oculto")) return; // saltamos ocultos
      if ((a.id||"").toLowerCase() === "linksalir") return; // no duplicar salir
      const nuevo = a.cloneNode(true);
      nuevo.removeAttribute("id"); // evitar IDs duplicados
      lista.appendChild(nuevo);
    });

    
    if (u) {
      const salirMov = document.createElement("a");
      salirMov.href = "#";
      salirMov.id = "linkSalirMov";
      salirMov.textContent = "Salir";
      lista.appendChild(salirMov);
    }

    lista.dataset.clonado = "1";
  }

  // abrir / cerrar menú
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
    lista.addEventListener("click", (e) => {
      const esLink = e.target.closest("a");
      if (esLink) cerrar();
    });
    btn.dataset.bind = "1";
  }

  // listeners de los enlaces móviles que agregamos
  const linkMiCuentaMov = document.getElementById("linkMiCuentaMov");
  if (linkMiCuentaMov && !linkMiCuentaMov.dataset.bind) {
    linkMiCuentaMov.addEventListener("click", (e)=>{
      e.preventDefault();
      abrirPanelCuenta(); // abre el panel con los datos del usuario
    });
    linkMiCuentaMov.dataset.bind = "1";
  }

  const linkSalirMov = document.getElementById("linkSalirMov");
  if (linkSalirMov && !linkSalirMov.dataset.bind) {
    linkSalirMov.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("sesion");
      actualizarNavegacion();
      cerrar();

      // Verificar si estamos dentro de /admin/
      if (location.pathname.includes("/admin/")) {
        window.location.href = "../index.html";
      } else {
        window.location.href = "index.html";
      }
    });
    linkSalirMov.dataset.bind = "1";
  }
}

/* =============== MI CUENTA (DIALOG) =============== */
function abrirPanelCuenta(){
  const u = usuarioActual();
  const panel = document.getElementById("panelCuenta");
  const cortina = document.getElementById("cortinaCuenta");
  if (!u || !panel || !cortina) return;

  // Asegurar código y guardar por si no tenía
  asegurarCodigoReferido(u);
  guardarUsuarioActual(u);

  // Llenar campos
  const nom = document.getElementById("cuentaNombre");
  const cor = document.getElementById("cuentaCorreo");
  const cod = document.getElementById("cuentaCodigoReferido");
  const pts = document.getElementById("cuentaPuntos");
  const niv = document.getElementById("cuentaNivel");
  if (nom) nom.textContent = `${u.nombres||""} ${u.apellidos||""}`.trim() || "—";
  if (cor) cor.textContent = u.correo || "—";
  if (cod) cod.value = u.codigoReferido;
  if (pts) pts.textContent = u.puntosLevelUp ?? 0;
  if (niv) niv.textContent = calcularNivel(u.puntosLevelUp || 0);

  // Copiar
  const btnCopiar = document.getElementById("btnCopiarCodigo");
  if (btnCopiar && !btnCopiar.dataset.bind) {
    btnCopiar.addEventListener("click", ()=>{
      const inp = document.getElementById("cuentaCodigoReferido");
      inp.select();
      document.execCommand("copy");
      btnCopiar.textContent = "¡Copiado!";
      setTimeout(()=> btnCopiar.textContent = "Copiar", 1200);
    });
    btnCopiar.dataset.bind = "1";
  }

  // Cerrar panel
  const cerrar = ()=>{
    panel.classList.remove("panel-cuenta--abierto");
    panel.setAttribute("aria-hidden", "true");
    cortina.hidden = true;
  };
  const btnCerrar = document.getElementById("btnCerrarCuenta");
  if (btnCerrar && !btnCerrar.dataset.bind) {
    btnCerrar.addEventListener("click", cerrar);
    btnCerrar.dataset.bind = "1";
  }
  if (!cortina.dataset.bind) {
    cortina.addEventListener("click", cerrar);
    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape" && panel.classList.contains("panel-cuenta--abierto")) cerrar();
    });
    cortina.dataset.bind = "1";
  }

  // Salir desde el panel
  const btnSalir = document.getElementById("btnSalirCuenta");
  if (btnSalir && !btnSalir.dataset.bind) {
    btnSalir.addEventListener("click", ()=>{
      localStorage.removeItem("sesion");
      actualizarNavegacion();
      cerrar();

      // Redirección según si estamos en admin o no
      if (location.pathname.includes("/admin/")) {
        window.location.href = "../index.html";
      } else {
        window.location.href = "index.html";
      }
    });
    btnSalir.dataset.bind = "1";
  }

  // Abrir panel
  panel.classList.add("panel-cuenta--abierto");
  panel.setAttribute("aria-hidden", "false");
  cortina.hidden = false;
}

/* =============== INICIALIZACIÓN =============== */
document.addEventListener("DOMContentLoaded", () => {
  // Nav / Sesion
  actualizarNavegacion();

  // Salir de sesión
  const linkSalir = document.getElementById("linkSalir");
  if(linkSalir){
    linkSalir.addEventListener("click", (e)=>{
      e.preventDefault();
      localStorage.removeItem("sesion");
      actualizarNavegacion();
      window.location.href = "index.html";
    });
  }

  // Botón perfil (desktop)
  const btnPerfilDesk = document.getElementById("btnPerfilDesk");
  if (btnPerfilDesk && !btnPerfilDesk.dataset.bind) {
    btnPerfilDesk.addEventListener("click", ()=>{
      if (!usuarioActual()) return; // por seguridad
      abrirPanelCuenta();
    });
    btnPerfilDesk.dataset.bind = "1";
  }

  // Index
  renderDestacados();

  // Formularios
  inicializarRegistro();

  // Menú móvil
  inicializarMenuLateral();
});
