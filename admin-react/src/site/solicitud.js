// reutilizo codigo para mostrar detalle de una solicitud en solicitud-detalle
function renderDetalleSolicitud(solicitud, idx) {
  if (!solicitud) return '<p>No se encontró la solicitud.</p>';
  const fecha = solicitud.fecha && solicitud.hora ? `${solicitud.fecha} ${solicitud.hora}` : (solicitud.fecha || "");
  return `<article class="tarjeta">
    <div class="contenido">
      <h4>Solicitud #${idx + 1}</h4>
      <p class="info">${fecha}</p>
      <p><strong>Nombre:</strong> ${solicitud.nombre || "-"}</p>
      <p><strong>Correo:</strong> ${solicitud.correo || "-"}</p>
      <p><strong>Descripción:</strong> ${solicitud.descripcion || "-"}</p>
      <p><strong>Estado:</strong> ${solicitud.estado || "-"}</p>
    </div>
  </article>`;
}

// botón de estado en solicitud-detalle
document.addEventListener("DOMContentLoaded", function() {
  const btnEstado = document.getElementById("btnMarcarAtendida");
  const divDetalle = document.getElementById("detalleSolicitud");
  if (btnEstado && divDetalle) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);
    let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
    let solicitud = solicitudes[id];
    function actualizarBoton() {
      if (!solicitud) {
        btnEstado.style.display = "none";
        return;
      }
      btnEstado.classList.remove("exito", "btn-estado");
      btnEstado.classList.add("secundario", "btn-estado");
      if (solicitud.estado === "pendiente") {
        btnEstado.textContent = "Marcar como completado";
      } else {
        btnEstado.textContent = "Marcar como pendiente";
      }
    }
    actualizarBoton();
    btnEstado.onclick = function() {
      if (!solicitud) return;
      solicitud.estado = solicitud.estado === "pendiente" ? "completado" : "pendiente";
      solicitudes[id] = solicitud;
      localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
      divDetalle.innerHTML = renderDetalleSolicitud(solicitud, id);
      actualizarBoton();
    };
  }
});

// para diferenciacion si estamos en solicitud-detalle y mostrar el detalle
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("detalleSolicitud")) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"), 10);
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
    const solicitud = solicitudes[id];
    document.getElementById("detalleSolicitud").innerHTML = renderDetalleSolicitud(solicitud, id);
  }
});
function renderTarjetasSolicitudes(solicitudes) {
  return solicitudes.map((sol, idx) => {
    // Botón para alternar estado
    const btnAccion = sol.estado === "pendiente"
      ? `<button class='btn secundario  btn-estado' data-idx='${idx}' data-estado='completado'>pendiente</button>`
      : `<button class='btn secundario  btn-estado' data-idx='${idx}' data-estado='pendiente'>completado</button>`;
    const fecha = sol.fecha && sol.hora ? `${sol.fecha} ${sol.hora}` : (sol.fecha || "");
    // Botón para ver detalle
  const btnDetalle = `<a href="solicitud-detalle.html?id=${idx}" class="btn secundario">Ver detalle</a>`;
    return `<article class="tarjeta">
      <div class="contenido">
        <h4>Solicitud ${idx + 1}</h4>
        <p class="info">${fecha}</p>
        <p><strong>Nombre:</strong> ${sol.nombre || "-"}</p>
        <p><strong>Correo:</strong> ${sol.correo || "-"}</p>
        <p><strong>Descripción:</strong> ${sol.descripcion || "-"}</p>
        <div class="acciones" style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          ${btnAccion}
          ${btnDetalle}
        </div>
      </div>
    </article>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", function() {
  //  roles

  const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  const filtro = document.getElementById("filtroSoliciutudes");
  filtro.addEventListener("change", mostrarSolicitudes);
  mostrarSolicitudes();

  function mostrarSolicitudes() {
    const valorFiltro = filtro.value;
    const filtradas = valorFiltro ? solicitudes.filter(s => s.estado === valorFiltro) : solicitudes;
    document.getElementById("listaSolicitud").innerHTML = renderTarjetasSolicitudes(filtradas);
  }

  // Delegación de eventos para los botones de cambiar estado
  document.getElementById("listaSolicitud").addEventListener("click", function(e) {
    if (e.target.matches("button[data-idx][data-estado]")) {
      const idx = Number(e.target.getAttribute("data-idx"));
      const nuevoEstado = e.target.getAttribute("data-estado");
      solicitudes[idx].estado = nuevoEstado;
      localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
      mostrarSolicitudes();
    }
  });
});