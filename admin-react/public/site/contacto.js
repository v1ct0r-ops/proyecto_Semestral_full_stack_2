// src/site/contacto.js

// Valida que los elementos existan antes de usarlos.
// Envuelto en una función para poder inicializar seguro en DOMContentLoaded
// y también poder llamarla manualmente (tests).
function initContacto() {
  const formulario = document.querySelector(".form-contacto");
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const contenido = document.getElementById("contenido");
  const botonEnviar = document.getElementById("btnEnviar");

  function validarFormulario() {
    // Si algo no existe aún, no hacemos nada
    if (!nombre || !correo || !contenido || !botonEnviar) return;
    const ok =
      nombre.value.trim() !== "" &&
      correo.value.trim() !== "" &&
      contenido.value.trim() !== "";
    botonEnviar.disabled = !ok;
  }

  function validarUsuario(vCorreo) {
    const eRegular = /^[a-zA-Z0-9._%+-]+@duoc\.cl$/;
    if (vCorreo === "") {
      alert("El correo no puede estar vacio");
      return false;
    } else if (!eRegular.test(vCorreo)) {
      alert("El correo debe ser del tipo usuario@duoc.cl");
      return false;
    } else if (vCorreo.length > 20) {
      alert("Importante: el correo no puede superar los 20 caracteres.");
      return false;
    } else if (/\s/.test(vCorreo)) {
      alert("El correo no puede contener espacios.");
      return false;
    }
    return true;
  }

  function validarNombre(vNombre) {
    const eRegularNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!eRegularNombre.test(vNombre)) {
      alert("El nombre debne contener solo caracteres alfabeticos y espacios.");
      return false;
    }
    return true;
  }

  function validarContenidoSeguro(vContenido) {
    const regex = /[<>]/;
    if (regex.test(vContenido)) {
      alert("El mensaje no puede contener < o >");
      return false;
    }
    return true;
  }

  // Bind de inputs (solo si existen)
  if (nombre) nombre.addEventListener("input", validarFormulario);
  if (correo) correo.addEventListener("input", validarFormulario);
  if (contenido) contenido.addEventListener("input", validarFormulario);

  // Submit del formulario (solo si existe)
  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      // Si faltan elementos, bloquea y no sigue
      if (!nombre || !correo || !contenido) {
        e.preventDefault();
        return;
      }

      if (
        !validarUsuario(correo.value) ||
        !validarNombre(nombre.value) ||
        !validarContenidoSeguro(contenido.value)
      ) {
        e.preventDefault();
        return;
      }

      // Guarda solicitud en localStorage (clave 'solicitudes', campo 'descripcion')
      const ahora = new Date();
      const seqActual = Number(localStorage.getItem("solicitudes_seq") || "0"); // 0 al inicio
      const seqNuevo = seqActual + 1;
      const id = `SOL-${seqNuevo}`;
      const mensaje = {
        id,
        titulo: id, // visible como SOL-...
        nombre: nombre.value,
        correo: correo.value,
        descripcion: contenido.value,
        fecha: ahora.toISOString(),
        fechaLocal: ahora.toLocaleDateString(),
        hora: ahora.toLocaleTimeString(),
        estado: "pendiente",
      };

      const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
      solicitudes.push(mensaje);
      localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
      localStorage.setItem("solicitudes_seq", String(seqNuevo));

      // Debug opcional
      // console.log("Nombre:", nombre.value);
      // console.log("Correo:", correo.value);
      // console.log("Contenido:", contenido.value);

      alert("¡Mensaje enviado correctamente!");
      formulario.reset();
      validarFormulario();
      e.preventDefault(); 
    });
  }

  // Inicial valid
  validarFormulario();
}

// 1) Si el DOM ya está listo, inicializa ahora.
// 2) Además, registra DOMContentLoaded por si el script se cargó en <head>.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContacto, { once: true });
} else {
  initContacto();
}

export { initContacto };

// 1) exportamos para tests:
if (typeof window !== "undefined") {
  window.__initContacto = initContacto;
}

// 2) auto-init para la app real (queda igual):
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContacto, { once: true });
} else {
  initContacto();
}
