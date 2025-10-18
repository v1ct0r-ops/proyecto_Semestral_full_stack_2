
import { productosBase, regiones, categorias } from "./datos.js";
import {
  obtener, guardar, usuarioActual,
  obtenerPedidos, guardarPedidos
} from "../utils/storage.js";

// /* =============== UTILIDADES =============== */
// function obtener(key, defecto){
//   try { return JSON.parse(localStorage.getItem(key)) ?? defecto; } catch { return defecto; }
// }
// function guardar(key, valor){
//   localStorage.setItem(key, JSON.stringify(valor));
// }
// function obtenerPedidos(){ 
//   return obtener("pedidos", []); }
// function guardarPedidos(peds){ 
//   guardar("pedidos", peds); }
// function esAdmin(){ 
//   const u=usuarioActual(); return !!(u && u.tipoUsuario==="admin"); }
// function esVendedor(){ 
//   const u=usuarioActual(); return !!(u && u.tipoUsuario==="vendedor"); }


// import { productosBase, regiones, categorias } from "./datos.js";


/* =============== Primera carga =============== */
if (!localStorage.getItem("productos") && Array.isArray(productosBase)) {
  guardar("productos", productosBase);
}
if (!localStorage.getItem("usuarios")) guardar("usuarios", []);
if (!localStorage.getItem("carrito"))  guardar("carrito", []);
if (!localStorage.getItem("resenas"))   guardar("resenas", {});

/* ======== SANEADOR DE STORAGE ======== */
function esObjPlano(x){ return x && typeof x === "object" && !Array.isArray(x); }

function sanearLocalStorage(){
  // Productos: debe ser array
  let prods = obtener("productos", []);
  if (!Array.isArray(prods)) {
    console.warn("[SANEAR] 'productos' no era Array. Lo reestablezco.");
    prods = Array.isArray(productosBase) ? productosBase : [];
    guardar("productos", prods);
  }

  // Carrito: debe ser array
  let carr = obtener("carrito", []);
  if (!Array.isArray(carr)) {
    console.warn("[SANEAR] 'carrito' no era Array. Lo reestablezco a [].");
    carr = [];
    guardar("carrito", carr);
  }

  // Usuarios: debe ser array
  let us = obtener("usuarios", []);
  if (!Array.isArray(us)) {
    console.warn("[SANEAR] 'usuarios' no era Array. Lo reestablezco a [].");
    us = [];
    guardar("usuarios", us);
  }

  // Reseñas: debe ser objeto plano
  let rs = obtener("resenas", {});
  if (!esObjPlano(rs)) {
    console.warn("[SANEAR] 'resenas' no era objeto. Lo reestablezco a {}.");
    rs = {};
    guardar("resenas", rs);
  }

  // Pedidos: debe ser array
  let peds = obtener("pedidos", []);
  if (!Array.isArray(peds)) {
    console.warn("[SANEAR] 'pedidos' no era Array. Lo reestablezco a [].");
    peds = [];
    guardar("pedidos", peds);
  }
}

sanearLocalStorage();


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
// function usuarioActual(){
//   const sesion = obtener("sesion", null);
//   if(!sesion) return null;
//   const usuarios = obtener("usuarios", []);
//   return usuarios.find(u => u.correo?.toLowerCase() === sesion.correo?.toLowerCase()) || null;
// }
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


/* PERFIL */

/* =============== PUNTOS / NIVELES + COMPRAS =============== */
const VALOR_PUNTO = 10;              // 1 punto = $10 CLP de descuento
const TOPE_DESC_POR_PUNTOS = 0.20;   // Máximo 20% del total usando puntos (guardado por si luego lo usas)

function asegurarCodigoReferido(usuario){
  if (!usuario.codigoReferido) {
    usuario.codigoReferido = "REF" + Math.random().toString(36).substring(2,8).toUpperCase();
  }
}
function calcularNivel(p){
  if (p >= 500) return "Oro";
  if (p >= 200) return "Plata";
  return "Bronce";
}
function puntosPorCompra(totalCLP, nivel){
  const base = Math.floor(totalCLP / 1000); // 1 punto por cada $1000
  if (nivel === "Plata") return Math.floor(base * 1.25);
  if (nivel === "Oro")   return Math.floor(base * 1.5);
  return base;
}
function guardarUsuarioActual(u){
  const usuarios = obtener("usuarios", []);
  const idx = usuarios.findIndex(x => x.correo?.toLowerCase() === u.correo?.toLowerCase());
  if (idx >= 0) {
    usuarios[idx] = u;
    guardar("usuarios", usuarios);
  }
}
function registrarCompraAlUsuario(u, items){
  // items: [{codigo, cantidad, precio}]
  u.compras = Array.isArray(u.compras) ? u.compras : [];
  const pedido = {
    id: "PED-" + Date.now(),
    fecha: new Date().toISOString(),
    items: items.map(it => ({ codigo: it.codigo, cantidad: it.cantidad, precio: it.precio }))
  };
  u.compras.push(pedido);
  guardarUsuarioActual(u);
}

/* =============== Cargar, validar y guardar datos del usuario =============== */
function inicializarPerfil(){
  const form = document.getElementById("formPerfil");
  if (!form) return; // no estás en perfil.html

  const u = usuarioActual();
  if (!u) { window.location.href = "login.html"; return; }

  // refs
  const iRun   = document.getElementById("p_run");
  const iNom   = document.getElementById("p_nombres");
  const iApe   = document.getElementById("p_apellidos");
  const iMail  = document.getElementById("p_correo");
  const iFecha = document.getElementById("p_fecha");
  const iReg   = document.getElementById("region");
  const iCom   = document.getElementById("comuna");
  const iDir   = document.getElementById("p_direccion");
  const msg    = document.getElementById("msgPerfil");

  // regiones/comunas

  if (iReg && iCom) {
    if (typeof regiones === "undefined" || !Array.isArray(regiones)) {
      console.warn("No se encontró 'regiones'. Asegúrate de cargar datos.js antes de app.js.");
    } else {
      iReg.innerHTML = regiones.map(r => `<option>${r.nombre}</option>`).join("");
      const actualizarComunas = () => {
        const r = regiones.find(x => x.nombre === iReg.value);
        iCom.innerHTML = (r?.comunas || []).map(c => `<option>${c}</option>`).join("");
      };
      iReg.addEventListener("change", actualizarComunas);
      actualizarComunas(); // primera carga
    }
  }

  // set valores iniciales
  if (iRun)   iRun.value   = u.run || "";
  if (iNom)   iNom.value   = u.nombres || "";
  if (iApe)   iApe.value   = u.apellidos || "";
  if (iMail)  iMail.value  = u.correo || "";
  if (iFecha) iFecha.value = u.fechaNacimiento || "";
  if (iDir)   iDir.value   = u.direccion || "";

  if (iReg && Array.isArray(regiones)) {
    // set región y disparar comunas
    const regionUsuario = u.region || (regiones[0]?.nombre || "");
    iReg.value = regionUsuario;
    iReg.dispatchEvent(new Event("change"));
  }

  // guardar
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    // limpiar msgs
    ["errPNombres","errPApellidos","errPCorreo","errPFecha","errPRegion","errPComuna","errPDireccion","msgPerfil"]
      .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ""; });

    const nombres = iNom.value.trim();
    const apellidos = iApe.value.trim();
    const correo = iMail.value.trim();
    const fechaNac = iFecha.value;
    const region = iReg ? iReg.value : "";
    const comuna = iCom ? iCom.value : "";
    const direccion = iDir.value.trim();

    let ok = true;
    if (!nombres)                            { document.getElementById("errPNombres").textContent = "Requerido."; ok=false; }
    if (!apellidos)                          { document.getElementById("errPApellidos").textContent = "Requerido."; ok=false; }
    if (!esCorreoPermitido(correo) || correo.length>100) {
      document.getElementById("errPCorreo").textContent = "Correo no permitido o demasiado largo."; ok=false;
    }
    if (!esMayorDe18(fechaNac))              { document.getElementById("errPFecha").textContent = "Debés ser mayor de 18."; ok=false; }
    if (iReg && !region)                     { document.getElementById("errPRegion").textContent = "Seleccioná una región."; ok=false; }
    if (iCom && !comuna)                     { document.getElementById("errPComuna").textContent = "Seleccioná una comuna."; ok=false; }
    if (!direccion || direccion.length>300)  { document.getElementById("errPDireccion").textContent = "Dirección inválida (máx 300)."; ok=false; }
    // correo único (si cambió)
    if (correo.toLowerCase() !== (u.correo||"").toLowerCase()){
      const otros = obtener("usuarios", []).filter(x => x.run !== u.run);
      if (otros.some(x => x.correo?.toLowerCase() === correo.toLowerCase())){
        document.getElementById("errPCorreo").textContent = "Ese correo ya está registrado."; ok=false;
      }
    }
    if (!ok) return;

    // actualizar user
    const users = obtener("usuarios", []);
    const idx = users.findIndex(x => x.run === u.run);
    if (idx >= 0) {
      users[idx].nombres = nombres;
      users[idx].apellidos = apellidos;
      users[idx].correo = correo;
      users[idx].fechaNacimiento = fechaNac;
      users[idx].region = region;
      users[idx].comuna = comuna;
      users[idx].direccion = direccion;

      guardar("usuarios", users);

      // si cambió el mail, actualizar la sesión
      const ses = obtener("sesion", null);
      if (ses && ses.correo?.toLowerCase() === (u.correo||"").toLowerCase()) {
        guardar("sesion", { correo: correo, tipo: u.tipoUsuario });
      }

      if (msg) msg.textContent = "Datos guardados.";
      setTimeout(()=>{ if (msg) msg.textContent=""; }, 1500);
      actualizarNavegacion();
    }
  });

  // abrir/cerrar modal pass
  const dlg = document.getElementById("dlgPass");
  const btnCambiar = document.getElementById("btnCambiarPass");
  const formPass = document.getElementById("formPass");
  const btnCancelarPass = document.getElementById("btnCancelarPass");

  if (btnCambiar) btnCambiar.addEventListener("click", ()=> dlg.showModal());
  if (btnCancelarPass) btnCancelarPass.addEventListener("click", ()=> dlg.close());

  // submit cambio de pass
  if (formPass){
    formPass.addEventListener("submit",(e)=>{
      e.preventDefault();

      ["errPassActual","errPassNueva","errPassNueva2","msgPass"].forEach(id=>{
        const el = document.getElementById(id); if (el) el.textContent = "";
      });

      const pAct = document.getElementById("passActual").value;
      const pNew = document.getElementById("passNueva").value;
      const pNew2= document.getElementById("passNueva2").value;
      let ok = true;

      if ((u.pass||"") !== pAct) { document.getElementById("errPassActual").textContent = "La contraseña actual no coincide."; ok=false; }
      if (pNew.length<4 || pNew.length>10) { document.getElementById("errPassNueva").textContent = "Debe tener 4 a 10 caracteres."; ok=false; }
      if (pNew !== pNew2) { document.getElementById("errPassNueva2").textContent = "La confirmación no coincide."; ok=false; }

      if (!ok) return;

      // guardar nueva pass
      const users = obtener("usuarios", []);
      const idx = users.findIndex(x => x.run === u.run);
      if (idx >= 0) {
        users[idx].pass = pNew;
        guardar("usuarios", users);
        document.getElementById("msgPass").textContent = "Contraseña actualizada ✔";
        setTimeout(()=> dlg.close(), 800);
      }
    });
  }
}


/* =============== MIS COMPRAS  =============== */
function renderMisCompras(){
  const cont = document.getElementById("listaCompras");
  if(!cont) return;

  const u = usuarioActual();
  if(!u){ cont.innerHTML = `<p class="info">Iniciá sesión para ver tus compras.</p>`; return; }

  const compras = Array.isArray(u.compras) ? u.compras : [];
  if (!compras.length){
    cont.innerHTML = `<p class="info">Aún no tenés compras.</p>`;
    return;
  }

  const prods = obtener("productos", []);
  // más recientes primero
  compras.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));

  cont.innerHTML = compras.map(ped=>{
    const fecha = new Date(ped.fecha).toLocaleString("es-CL");
    const estado = estadoPedido(ped.id); // "pendiente" | "despachado" | "cancelado"

    const badge =
      estado === "pendiente"  ? `<span class="badge peligro">Pendiente</span>` :
      estado === "despachado" ? `<span class="badge exito">Despachado</span>` :
                                `<span class="badge secundario">Cancelado</span>`;

    const filas = ped.items.map(it=>{
      const p = prods.find(x=>x.codigo===it.codigo);
      const nombre = p ? p.nombre : it.codigo;
      return `<div class="item-carrito">
        <div><strong>${nombre}</strong><br><small>${it.codigo}</small></div>
        <div>${formatoPrecio(it.precio)}</div>
        <div>x${it.cantidad}</div>
        <div>
          <a class="btn secundario" href="producto.html?codigo=${encodeURIComponent(it.codigo)}#resenas">Calificar</a>
        </div>
      </div>`;
    }).join("");

    // Botón Cancelar solo si está pendiente
    const btnCancelar = (estado === "pendiente")
      ? `<button class="btn peligro" data-cancelar="${ped.id}">Cancelar pedido</button>`
      : "";

    return `<article class="tarjeta">
      <div class="contenido">
        <h4>Pedido ${ped.id} ${badge}</h4>
        <p class="info">${fecha}</p>
        ${filas}
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          ${btnCancelar}
        </div>
      </div>
    </article>`;
  }).join("");

  // Delegación: abrir modal
  if (!cont.dataset.bind){
    cont.addEventListener("click",(e)=>{
      const btn = e.target.closest("[data-cancelar]");
      if (!btn) return;
      const id = btn.getAttribute("data-cancelar");
      const dlg = document.getElementById("dlgCancelarPedido");
      const hid = document.getElementById("cancelarPedidoId");
      if (!dlg || !hid) return;
      hid.value = id;
      dlg.showModal();
    });
    cont.dataset.bind = "1";
  }

  // Botones del modal
  const dlg = document.getElementById("dlgCancelarPedido");
  const btnOk = document.getElementById("btnConfirmarCancelacion");
  const btnClose = document.getElementById("btnCerrarCancelacion");

  if (dlg && btnOk && !btnOk.dataset.bind){
    btnOk.addEventListener("click", ()=>{
      const id = document.getElementById("cancelarPedidoId").value;
      if (!id) return;

      // 1) Actualizar estado en la lista global
      const pedidos = obtenerPedidos();
      const ped = pedidos.find(p => p.id === id);
      if (ped && ped.estado === "pendiente") {
        ped.estado = "cancelado";
        guardarPedidos(pedidos);
      }

      // 2) (Opcional) No cambiamos el histórico del usuario; solo el estado global
      dlg.close();
      renderMisCompras();
      alert("Pedido cancelado.");
    });
    btnOk.dataset.bind = "1";
  }
  if (dlg && btnClose && !btnClose.dataset.bind){
    btnClose.addEventListener("click", ()=> dlg.close());
    btnClose.dataset.bind = "1";
  }
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

Object.assign(window, {
  agregarAlCarrito,
  quitarDelCarrito,
  cambiarCantidad
});

/* PANELES */

/* =============== MENÚ LATERAL (MOVIL) =============== */
function inicializarMenuLateral(){
  const btn = document.getElementById("btnMenu");
  const panel = document.getElementById("menuLateral");
  const cortina = document.getElementById("cortina");
  const navDesk = document.querySelector(".navegacion");
  const lista = document.getElementById("menuLista");
  if (!btn || !panel || !navDesk || !lista) return;

  // reconstruir el nav para escrito solo una vez
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

    // 2) Clonamos los enlaces del nav de escritorio
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
        window.location.href = "../cliente/index.html";
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

      // Redireccion segun rol
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


/* PRODUCTOS */


/* ===== Productos / Filtros ===== */
function precioConDescuento(precio){
  const u = usuarioActual();
  const esDuoc = !!(u && u.correo?.toLowerCase().endsWith("@duoc.cl"));
  return esDuoc ? Math.round(precio*0.8) : precio; // 20% off
}

function popularCategorias(){
  const sel = document.getElementById("filtroCategoria");
  const selAdmin = document.getElementById("categoriaProducto");
  const prods = obtener("productos", []);
  const cats = Array.from(new Set(prods.map(p=>p.categoria))).sort();

  if (sel){
    sel.innerHTML = '<option value="">Todas las categorías</option>' +
      cats.map(c=>`<option>${c}</option>`).join("");
  }
  if (selAdmin){
    selAdmin.innerHTML = cats.map(c=>`<option>${c}</option>`).join("");
  }
}

// Normaliza texto para búsqueda (quita acentos, pasa a lowercase)
function norm(txt){
  return (txt||"")
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().trim();
}

function renderProductos(){
  const grid = document.getElementById("gridProductos");
  if (grid && !grid.dataset.bindAdd) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest('button[data-add]');
      if (!btn) return;
      const codigo = btn.dataset.add;
      agregarAlCarrito(codigo); // tu función normal (no hace falta ponerla en window)
    });
    grid.dataset.bindAdd = "1";
  }

  const texto = norm(document.getElementById("buscador")?.value || "");
  const cat = document.getElementById("filtroCategoria")?.value || "";

  const prods = obtener("productos", []).filter(p=>{
    const okCat = !cat || p.categoria === cat;
    const hayTexto = !!texto;
    const nombreOK = norm(p.nombre).includes(texto);
    const codigoOK = norm(p.codigo).includes(texto);
    // si hay texto, debe coincidir nombre o código
    const okTxt = !hayTexto || nombreOK || codigoOK;
    return okCat && okTxt;
  });

  if (prods.length === 0){
    grid.innerHTML = `
      <div class="tarjeta" style="padding:16px; text-align:center;">
        <p class="info">Sin resultados. Probá otra búsqueda o categoría.</p>
      </div>`;
    return;
  }

  grid.innerHTML = prods.map(p => `
  <article class="tarjeta tarjeta-producto">
    <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'">
    <div class="contenido">
      <h3>${p.nombre}</h3>
      <small>${p.categoria}</small>
      <p class="precio">${formatoPrecio(precioConDescuento(p.precio))}</p>
      <div class="acciones">
        <a class="btn secundario" href="producto.html?codigo=${encodeURIComponent(p.codigo)}">Ver</a>
        <button class="btn primario" data-add="${p.codigo}" type="button">Añadir</button>
      </div>
    </div>
  </article>
`).join("");
}

/* =============== DETALLE DE PRODUCTO + RESEÑAS =============== */
function obtenerResenas(){ return obtener("resenas", {}); }
function guardarResenas(obj){ guardar("resenas", obj); }

function promedioResenas(codigo){
  const all = obtenerResenas();
  const arr = all[codigo] || [];
  if (!arr.length) return 0;
  const sum = arr.reduce((s, r) => s + (Number(r.rating)||0), 0);
  return Math.round((sum / arr.length) * 10)/10; // 1 decimal
}
function usuarioComproProducto(u, codigo){
  if (!u || !Array.isArray(u.compras)) return false;
  return u.compras.some(ped => Array.isArray(ped.items) && ped.items.some(it => it.codigo === codigo));
}

function renderResenasProducto(codigo){
  const all = obtenerResenas();
  const arr = all[codigo] || [];
  const cont = document.getElementById("listaResenas");
  const promEl = document.getElementById("promedioResenas");
  const cantEl = document.getElementById("cantidadResenas");

  if (promEl) promEl.textContent = promedioResenas(codigo).toFixed(1);
  if (cantEl) cantEl.textContent = arr.length;

  if (cont){
    cont.innerHTML = arr.length
      ? arr.map(r => `
        <div class="resena-item">
          <div>⭐ ${r.rating} / 5</div>
          <div class="autor">${(r.nombre || r.correo || "Usuario")} — ${new Date(r.fecha).toLocaleDateString('es-CL')}</div>
          <div>${(r.comentario || '').replace(/</g,"&lt;")}</div>
        </div>
      `).join("")
      : "<p class='info'>Aún no hay reseñas.</p>";
  }
}
function prepararFormResena(codigo){
  const u = usuarioActual();
  const box = document.getElementById("formResenaBox");
  const bloqueo = document.getElementById("bloqueoResena");
  if (!box || !bloqueo) return;

  if (!u){
    box.classList.add("oculto");
    bloqueo.classList.remove("oculto");
    bloqueo.textContent = "Iniciá sesión para calificar.";
    return;
  }
  const puede = usuarioComproProducto(u, codigo);
  if (!puede){
    box.classList.add("oculto");
    bloqueo.classList.remove("oculto");
    bloqueo.textContent = "Debés haber comprado este producto para poder calificarlo.";
    return;
  }

  box.classList.remove("oculto");
  bloqueo.classList.add("oculto");

  const btn = document.getElementById("btnEnviarResena");
  const puntaje = document.getElementById("puntajeResena");
  const comentario = document.getElementById("comentarioResena");
  const msg = document.getElementById("msgResena");

  if (btn && !btn.dataset.bind){
    btn.addEventListener("click", ()=>{
      const rating = Math.max(1, Math.min(5, Number(puntaje.value)||5));
      const texto = (comentario.value || "").trim();
      const all = obtenerResenas();
      all[codigo] = all[codigo] || [];

      // evitar múltiples reseñas del mismo usuario
      const uAct = usuarioActual(); // por si cambió
      if (!uAct) { msg.textContent = "Sesión finalizada."; return; }
      const ya = all[codigo].some(r => r.correo?.toLowerCase() === uAct.correo.toLowerCase());
      if (ya){ msg.textContent = "Ya enviaste una reseña para este producto."; return; }

      all[codigo].push({
        correo: uAct.correo,
        nombre: `${uAct.nombres||""} ${uAct.apellidos||""}`.trim(),
        rating,
        comentario: texto,
        fecha: new Date().toISOString()
      });
      guardarResenas(all);

      comentario.value = "";
      renderResenasProducto(codigo);
      msg.textContent = "¡Gracias! Tu reseña fue publicada.";
      setTimeout(()=> msg.textContent="", 1500);
    });
    btn.dataset.bind = "1";
  }
}

function cargarDetalle(){
  const params = new URLSearchParams(location.search);
  const codigo = params.get("codigo");
  if(!codigo) return;

  const prod = obtener("productos", []).find(p=>p.codigo===codigo);
  if(!prod) return;

  const img = document.getElementById("imagenDetalle");
  const nom = document.getElementById("nombreDetalle");
  const cat = document.getElementById("categoriaDetalle");
  const pre = document.getElementById("precioDetalle");
  const des = document.getElementById("descripcionDetalle");

  if (img) img.src = prod.imagen;
  if (nom) nom.textContent = prod.nombre;
  if (cat) cat.textContent = prod.categoria;
  if (pre) pre.textContent = formatoPrecio(precioConDescuento(prod.precio));
  if (des) des.textContent = prod.descripcion || "";

  // ===== Ver más (detalles) =====
  const link = document.getElementById("linkVerMas");
  const box  = document.getElementById("boxDetalles");
  const txt  = document.getElementById("detallesDetalle");

  if (link && box && txt){
    const hayDetalles = !!prod.detalles && prod.detalles.trim() !== "";
    if (!hayDetalles){
      // si no hay detalles, ocultamos el link
      link.style.display = "none";
      box.hidden = true;
    } else {
      txt.textContent = prod.detalles;
      box.hidden = true; // inicia plegado
      link.textContent = "Ver más";
      if (!link.dataset.bind){
        link.addEventListener("click",(e)=>{
          e.preventDefault();
          const abierto = !box.hidden;
          box.hidden = abierto; // toggle
          link.textContent = abierto ? "Ver más" : "Ocultar";
        });
        link.dataset.bind = "1";
      }
    }
  }

  // Botón agregar
  const btn = document.getElementById("btnAgregarDetalle");
  if (btn){
    btn.addEventListener("click", ()=>{
      const cant = parseInt(document.getElementById("cantidadDetalle")?.value||"1",10);
      agregarAlCarrito(codigo, cant);
    });
  }

  // Reseñas
  renderResenasProducto(codigo);
  prepararFormResena(codigo);
}

// ========= Admin / Listados =========

// function popularCategorias(){
//   const sel      = document.getElementById("filtroCategoria");
//   const selAdmin = document.getElementById("categoriaProducto");

//   // Preferimos la lista base de datos.js; si no existe, derivamos de los productos guardados
//   const baseCats  = Array.isArray(categorias) ? categorias : [];
//   const derivadas = Array.from(new Set(obtener("productos", []).map(p=>p.categoria).filter(Boolean)));
//   const cats      = (baseCats.length ? baseCats : derivadas).sort();

//   if (sel){
//     sel.innerHTML = '<option value="">Todas las categorías</option>' +
//                     cats.map(c=>`<option>${c}</option>`).join("");
//   }
//   if (selAdmin){
//     selAdmin.innerHTML = cats.map(c=>`<option>${c}</option>`).join("");
//   }
// }


document.addEventListener("DOMContentLoaded", ()=>{
  // Guard de admin
  if (location.pathname.includes("/admin/")) {
    const u = usuarioActual();
    const esAdmin     = () => u && u.tipoUsuario === "admin";
    const esVendedor  = () => u && u.tipoUsuario === "vendedor";

    // Bloquear acceso si no es admin ni vendedor
    if (!u || (!esAdmin() && !esVendedor())) {
      alert("Acceso restringido.");
      window.location.href = "../index.html";
      return;
    }

    // Si es vendedor, bloquear rutas prohibidas y devolver a admin.html
    const path    = location.pathname.toLowerCase();
    const archivo = path.split("/").pop(); // ej: "usuarios.html"
    const prohibidasVendedor = new Set([
      "usuarios.html",
      "usuario-nuevo.html",
      "producto-nuevo.html",
      "nuevo-producto.html",
    ]);
    if (esVendedor() && prohibidasVendedor.has(archivo)) {
      alert("Acceso no permitido para tu rol.");
      window.location.href = "admin.html";
      return;
    }

    // Ajustes de UI según rol:
    // 1) Vendedor NO ve "Usuarios" en el menú lateral
    const linkUsuarios = document.querySelector('.menu-admin a[href="usuarios.html"]');
    if (esVendedor() && linkUsuarios) linkUsuarios.remove();

    // 2) Vendedor NO ve el botón "Nuevo producto" (asegúrate de que el botón tenga id="btnNuevoProducto")
    const btnNuevo = document.getElementById("btnNuevoProducto");
    if (esVendedor() && btnNuevo) btnNuevo.style.display = "none";

    // 3) Vendedor NO ve el KPI de Usuarios (asegúrate de que el wrapper tenga id="kpiUsuariosBox")
    const kpiUsuariosBox = document.getElementById("kpiUsuariosBox");
    if (esVendedor() && kpiUsuariosBox) kpiUsuariosBox.style.display = "none";

    // 4) Accesos rápidos solo para admin
    if (esVendedor()) {
      document.querySelectorAll(".solo-admin").forEach(el => el.remove());
    }

    // 5) Título dinámico
    const titulo = document.querySelector("title");
    if (titulo) titulo.textContent = esAdmin()
      ? "Administrador | Level-Up Gamer"
      : "Vendedor | Level-Up Gamer";
  }

  popularCategorias();

  // KPI
  if(document.getElementById("kpiProductos")){
    document.getElementById("kpiProductos").textContent = obtener("productos", []).length;
  }
  if(document.getElementById("kpiUsuarios")){
    document.getElementById("kpiUsuarios").textContent = obtener("usuarios", []).length;
  }
  if (document.getElementById("kpiPedidos")){
  const pendientes = obtenerPedidos().filter(p=>p.estado==="pendiente").length;
  document.getElementById("kpiPedidos").textContent = pendientes;
}


  // Tabla productos
  const cuerpo = document.getElementById("tablaProductos");
  if (cuerpo){
    const u = usuarioActual();
    const esAdmin = !!(u && u.tipoUsuario === "admin");

    const prods = obtener("productos", []);

    const thAcciones = document.getElementById("thAcciones");
    if (thAcciones) thAcciones.style.display = esAdmin ? "" : "none";

    cuerpo.innerHTML = prods.map(p=>`
      <tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${formatoPrecio(p.precio)}</td>
        <td>${p.stock ?? "—"}</td>
        <td style="${esAdmin ? "" : "display:none"}">
          <a class="btn secundario" href="editar-producto.html?codigo=${encodeURIComponent(p.codigo)}">Editar</a>
        </td>
      </tr>
    `).join("");
  }


  // Nuevo producto
  const formProd = document.getElementById("formProducto");
  if(formProd){
    formProd.addEventListener("submit",(e)=>{
      e.preventDefault();
      const codigo = document.getElementById("codigoProducto").value.trim();
      const nombre = document.getElementById("nombreProducto").value.trim();
      const descripcion = document.getElementById("descripcionProducto").value.trim();
      const detalles = document.getElementById("detallesProducto")?.value.trim() || "";
      const precio = parseFloat(document.getElementById("precioProducto").value);
      const stock = parseInt(document.getElementById("stockProducto").value,10);
      const stockCrit = document.getElementById("stockCriticoProducto").value ? parseInt(document.getElementById("stockCriticoProducto").value,10) : null;
      const categoria = document.getElementById("categoriaProducto").value;
      const imagen = document.getElementById("imagenProducto").value.trim();

      // Validaciones requeridas por anexos
      let ok=true;
      const setErr = (id,txt)=>{ const el=document.getElementById(id); if(el) el.textContent=txt; if(txt) ok=false; };
      setErr("errCodigoProducto", codigo.length>=3? "": "Mínimo 3 caracteres.");
      setErr("errNombreProducto", nombre && nombre.length<=100? "": "Requerido (máx 100).");
      setErr("errPrecioProducto", isNaN(precio)||precio<0? "Precio inválido (>=0)": "");
      setErr("errStockProducto", isNaN(stock)||stock<0||!Number.isInteger(stock)? "Stock entero >=0": "");
      setErr("errCategoriaProducto", categoria? "": "Seleccioná una categoría.");
      if(!ok) return;

      const prods = obtener("productos", []);
      if(prods.some(p=>p.codigo.toUpperCase()===codigo.toUpperCase())){
        document.getElementById("errCodigoProducto").textContent="El código ya existe."; return;
      }
      prods.push({codigo, nombre, descripcion, detalles, precio, stock, stockCritico:stockCrit, categoria, imagen});
      guardar("productos", prods);
      document.getElementById("msgProducto").textContent = "Producto guardado.";
      formProd.reset();
    });
  }

  // Tabla usuarios
  const cuerpoU = document.getElementById("tablaUsuarios");
  if(cuerpoU){
    const us = obtener("usuarios", []);
    cuerpoU.innerHTML = us.map(u=>`<tr><td>${u.run}</td><td>${u.nombres} ${u.apellidos}</td><td>${u.correo}</td><td>${u.tipoUsuario}</td></tr>`).join("");
  }

  // Nuevo usuario (admin)
  const formUA = document.getElementById("formUsuarioAdmin");
  if(formUA){
    formUA.addEventListener("submit",(e)=>{
      e.preventDefault();
      const run = document.getElementById("runAdmin").value.trim();
      const nombres = document.getElementById("nombresAdmin").value.trim();
      const apellidos = document.getElementById("apellidosAdmin").value.trim();
      const correo = document.getElementById("correoAdmin").value.trim();
      const tipoUsuario = document.getElementById("tipoUsuarioAdmin").value;
      const direccion = document.getElementById("direccionAdmin").value.trim();
      let ok=true;
      const setErr = (id,txt)=>{ const el=document.getElementById(id); if(el) el.textContent=txt; if(txt) ok=false; };
      setErr("errRunAdmin", validarRun(run)? "": "RUN inválido.");
      setErr("errCorreoAdmin", esCorreoPermitido(correo)&&correo.length<=100? "": "Correo no permitido.");
      if(!nombres) ok=false;
      if(!apellidos) ok=false;
      if(!direccion || direccion.length>300) ok=false;
      const users = obtener("usuarios", []);
      if(users.some(u=>u.run.toUpperCase()===run.toUpperCase())){ setErr("errRunAdmin","RUN ya existe."); }
      if(users.some(u=>u.correo.toLowerCase()===correo.toLowerCase())){ setErr("errCorreoAdmin","Correo ya existe."); }
      if(!ok) return;
      users.push({run,nombres,apellidos,correo,fechaNacimiento:"",tipoUsuario,region:"",comuna:"",direccion,pass:"admin",descuentoDuoc:correo.endsWith("@duoc.cl"),puntosLevelUp:0,codigoReferido:""});
      guardar("usuarios", users);
      document.getElementById("msgUsuarioAdmin").textContent = "Usuario guardado.";
      formUA.reset();
    });
  }
});

// === Editar Producto (solo admin) ===
function inicializarEditarProducto(){
  if (!location.pathname.endsWith("/admin/editar-producto.html")) return;

  const u = usuarioActual();
  if (!u || u.tipoUsuario !== "admin"){
    alert("Acceso no permitido.");
    window.location.href = "admin.html";
    return;
  }

  // inputs
  const iCod   = document.getElementById("e_codigoProducto");
  const iNom   = document.getElementById("e_nombreProducto");
  const iDesc  = document.getElementById("e_descripcionProducto");
  const iDet   = document.getElementById("e_detallesProducto");
  const iPrecio= document.getElementById("e_precioProducto");
  const iStock = document.getElementById("e_stockProducto");
  const iCrit  = document.getElementById("e_stockCriticoProducto");
  const iCat   = document.getElementById("e_categoriaProducto");
  const iImg   = document.getElementById("e_imagenProducto");
  const form   = document.getElementById("formEditarProducto");
  const msg    = document.getElementById("msgEditarProducto");

  // categorías
  // reutiliza tu popularCategorias pero con select específico:
  (function popularCatsEditar(){
    const baseCats  = Array.isArray(categorias) ? categorias : [];
    const derivadas = Array.from(new Set(obtener("productos", []).map(p=>p.categoria).filter(Boolean)));
    const cats      = (baseCats.length ? baseCats : derivadas).sort();
    iCat.innerHTML  = cats.map(c=>`<option>${c}</option>`).join("");
  })();

  // producto por querystring
  const params = new URLSearchParams(location.search);
  const codigo = params.get("codigo");
  const productos = obtener("productos", []);
  const prod = productos.find(p => p.codigo === codigo);

  if (!prod){
    alert("Producto no encontrado.");
    window.location.href = "productos.html";
    return;
  }

  // setear valores
  iCod.value    = prod.codigo;
  iNom.value    = prod.nombre || "";
  iDesc.value   = prod.descripcion || "";
  iDet.value    = prod.detalles || "";
  iPrecio.value = Number(prod.precio ?? 0);
  iStock.value  = Number(prod.stock ?? 0);
  iCrit.value   = prod.stockCritico ?? "";
  iCat.value    = prod.categoria || (iCat.options[0]?.value || "");
  iImg.value    = prod.imagen || "";

  // guardar
  form.addEventListener("submit", (e)=>{
    e.preventDefault();

    // validaciones simples
    let ok = true;
    const setErr = (id, txt)=>{ const el=document.getElementById(id); if(el) el.textContent=txt; if(txt) ok=false; };

    const nombre = iNom.value.trim();
    const precio = parseFloat(iPrecio.value);
    const stock  = parseInt(iStock.value, 10);
    const categoria = iCat.value;

    setErr("errENombre", nombre && nombre.length<=100 ? "" : "Requerido (máx 100).");
    setErr("errEPrecio", (!isNaN(precio) && precio>=0) ? "" : "Precio inválido (>=0).");
    setErr("errEStock",  (!isNaN(stock)  && stock>=0  && Number.isInteger(stock)) ? "" : "Stock entero >=0.");
    setErr("errECategoria", categoria ? "" : "Seleccioná una categoría.");
    if (!ok) return;

    // aplicar cambios
    prod.nombre       = nombre;
    prod.descripcion  = iDesc.value.trim();
    prod.detalles     = iDet.value.trim();
    prod.precio       = precio;
    prod.stock        = stock;
    prod.stockCritico = iCrit.value ? parseInt(iCrit.value,10) : null;
    prod.categoria    = categoria;
    prod.imagen       = iImg.value.trim();

    guardar("productos", productos);

    if (msg) msg.textContent = "Cambios guardados.";
    setTimeout(()=>{ if(msg) msg.textContent=""; }, 1200);
  });
}


/* PEDIDOS */
// helper centralizado
function idIgual(a, b){
  const s = v => String(v).trim().toUpperCase();      // normaliza
  return s(a) === s(b);
}


function estadoPedido(id){
  const p = obtenerPedidos().find(x => idIgual(x.id, id));
  return p ? p.estado : "pendiente";
}


function renderPedidos(){
  const cont = document.getElementById("listaPedidos");
  const filtro = document.getElementById("filtroPedidos");
  if (!cont || !filtro) return;

  const estado = filtro.value; // "", "pendiente", "despachado", "cancelado" (si agregás esta opción)
  let arr = obtenerPedidos();

  arr.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));
  if (estado) arr = arr.filter(p => p.estado === estado);

  if (!arr.length){
    cont.innerHTML = `<p class="info">No hay pedidos para este filtro.</p>`;
    return;
  }

  cont.innerHTML = arr.map(p => {
    const fecha = new Date(p.fecha).toLocaleString("es-CL");
    const badge = p.estado === "pendiente" 
      ? `<a class="btn peligro" href="pedidos-detalles.html?id=${encodeURIComponent(p.id)}">Pendiente</a>`
      : p.estado === "despachado"
      ? `<a class="btn exito" href="pedidos-detalles.html?id=${encodeURIComponent(p.id)}">Despachado</a>`
      : `<a class="btn secundario" href="pedidos-detalles.html?id=${encodeURIComponent(p.id)}">Cancelado</a>`;

    return `
      <article class="tarjeta">
        <div class="contenido">
          <h4>${p.id}</h4>
          <p class="info">${fecha} · ${p.comprador.nombres} ${p.comprador.apellidos} (${p.comprador.correo})</p>
          <p><small>Envío: ${p.envio.direccion}, ${p.envio.comuna}, ${p.envio.region}</small></p>
          <p><strong>Total:</strong> ${formatoPrecio(p.total)}</p>
          <div>${badge} <a class="btn secundario" href="pedidos-detalles.html?id=${encodeURIComponent(p.id)}">Ver detalle</a></div>
        </div>
      </article>`;
  }).join("");
}

function cargarPedidoDetalle(){
  if (!location.pathname.endsWith("/admin/pedidos-detalles.html")) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const cont = document.getElementById("detallePedido");
  const titulo = document.getElementById("tituloPedido");
  const btn = document.getElementById("btnMarcarDespachado");
  if (!id || !cont || !btn) return;

  const pedidos = obtenerPedidos();
  const ped = obtenerPedidos().find(p => idIgual(p.id, id));
  // const ped = pedidos.find(p => p.id === id);
  if (!ped){ cont.innerHTML = `<p class="info">Pedido no encontrado.</p>`; btn.style.display="none"; return; }

  if (titulo) titulo.textContent = `Pedido ${ped.id} — ${ped.estado.toUpperCase()}`;

  const prods = obtener("productos", []);
  const filas = ped.items.map(it=>{
    const p = prods.find(x=>x.codigo===it.codigo);
    const nombre = p ? p.nombre : it.codigo;
    return `<div class="item-carrito">
      <div><strong>${nombre}</strong><br><small>${it.codigo}</small></div>
      <div>${formatoPrecio(it.precio)}</div>
      <div>x${it.cantidad}</div>
    </div>`;
  }).join("");

  cont.innerHTML = `
    <article class="tarjeta">
      <div class="contenido">
        <p><strong>Fecha:</strong> ${new Date(ped.fecha).toLocaleString("es-CL")}</p>
        <p><strong>Cliente:</strong> ${ped.comprador.nombres} ${ped.comprador.apellidos} — ${ped.comprador.correo}</p>
        <p><strong>Envío:</strong> ${ped.envio.direccion}, ${ped.envio.comuna}, ${ped.envio.region}</p>
        <p><strong>Total:</strong> ${formatoPrecio(ped.total)}</p>
        <h4>Ítems</h4>
        ${filas}
      </div>
    </article>
  `;

  const actualizarBoton = ()=>{
    if (ped.estado === "pendiente") {
      btn.textContent = "Marcar como despachado";
      btn.className = "btn exito";
      btn.disabled = false;
      btn.style.display = "";
    } else if (ped.estado === "despachado") {
      btn.textContent = "Pedido despachado";
      btn.className = "btn secundario";
      btn.disabled = true;
      btn.style.display = "";
    } else { // cancelado
      btn.textContent = "Pedido cancelado";
      btn.className = "btn secundario";
      btn.disabled = true;
      btn.style.display = "";
    }
  };
  actualizarBoton();

  if (!btn.dataset.bind){
    btn.addEventListener("click", ()=>{
      if (ped.estado !== "pendiente") return;
      ped.estado = "despachado";
      guardarPedidos(pedidos);
      actualizarBoton();
      alert("Pedido marcado como despachado.");
    });
    btn.dataset.bind = "1";
  }
}


/* =============== INICIALIZACIÓN =============== */
document.addEventListener("DOMContentLoaded", () => {
  // Nav / Sesion
  actualizarNavegacion();

  // Salir de sesiOn
  const linkSalir = document.getElementById("linkSalir");
  if (linkSalir && !linkSalir.dataset.bind) {
    linkSalir.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("sesion");
      actualizarNavegacion();
      window.location.href = "index.html";
    });
    linkSalir.dataset.bind = "1";
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

  // Productos
  if (document.getElementById("gridProductos")){
    popularCategorias();
    renderProductos();

    const filtro = document.getElementById("filtroCategoria");
    const buscador = document.getElementById("buscador");

    if (filtro && !filtro.dataset.bind){
      filtro.addEventListener("change", renderProductos);
      filtro.dataset.bind = "1";
    }
    if (buscador && !buscador.dataset.bind){
      buscador.addEventListener("input", renderProductos);
      buscador.dataset.bind = "1";
    }
  }

  // Si estamos en pedidos.html
  if (location.pathname.endsWith("/admin/pedidos.html")) {
    // guard de rol ya corre arriba
    const filtro = document.getElementById("filtroPedidos");
    if (filtro && !filtro.dataset.bind){
      filtro.addEventListener("change", renderPedidos);
      filtro.dataset.bind = "1";
    }
    renderPedidos();
  }

  // Formularios
  inicializarRegistro();
  inicializarLogin();
  inicializarPerfil();
  inicializarEditarProducto();

  // Detalle de producto
  cargarDetalle();

  // Detalles de pedido 
  cargarPedidoDetalle();

  // Carrito
  renderCarrito();

  // Botón pagar
  const btnPagar = document.getElementById("btnPagar");
  if (btnPagar && !btnPagar.dataset.bind){
    btnPagar.addEventListener("click", ()=>{
      const u = usuarioActual();
      if(!u){ alert("Debés iniciar sesión para pagar."); window.location.href = "login.html"; return; }

      // total + items para registrar
      const carrito = obtener("carrito", []);
      const prods = obtener("productos", []);
      let total = 0;
      const itemsCompra = [];

      carrito.forEach(it=>{
        const p = prods.find(x=>x.codigo===it.codigo);
        if (p) {
          total += p.precio * it.cantidad;
          itemsCompra.push({ codigo: p.codigo, cantidad: it.cantidad, precio: p.precio });
        }
      });

      // === crear pedido global para panel de Pedidos ===
      const pedidoId = "PED-" + Date.now();
      const pedido = {
        id: pedidoId,
        fecha: new Date().toISOString(),
        estado: "pendiente", // "pendiente" | "despachado"
        comprador: {
          run: u.run, nombres: u.nombres, apellidos: u.apellidos, correo: u.correo
        },
        envio: {
          region: u.region || "", comuna: u.comuna || "", direccion: u.direccion || ""
        },
        items: itemsCompra.map(it => ({ codigo: it.codigo, cantidad: it.cantidad, precio: it.precio })),
        total: total // sin descuentos, si querés guarda también total con descuento
      };
      const todos = obtenerPedidos();
      todos.push(pedido);
      guardarPedidos(todos);

      // puntos
      const nivel = calcularNivel(u.puntosLevelUp || 0);
      const ganados = puntosPorCompra(total, nivel);
      u.puntosLevelUp = (u.puntosLevelUp || 0) + ganados;
      asegurarCodigoReferido(u);

      // registrar compra
      registrarCompraAlUsuario(u, itemsCompra);
      

      alert(`Pago simulado. ¡Gracias por tu compra!\nGanaste ${ganados} puntos (Nivel: ${nivel}).`);
      guardar("carrito", []);
      renderCarrito();
      actualizarNavegacion();
    });
    btnPagar.dataset.bind = "1";
  }

  // Mis compras
  renderMisCompras();

  // Menu movil
  inicializarMenuLateral();
});