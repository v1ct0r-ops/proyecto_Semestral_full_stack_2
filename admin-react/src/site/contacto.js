//necesito saber si el input con id nombre correo y contenido tienen algo escrito
//si tienen algo escrito que el boton de enviar se habilite
//si no tienen nada escrito que el boton de enviar se deshabilite
const formulario = document.querySelector('.form-contacto');
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const contenido = document.getElementById("contenido");
const botonEnviar = document.getElementById("btnEnviar");

function validarFormulario() {
  if (nombre.value.trim() !== "" && correo.value.trim() !== "" && contenido.value.trim() !== "") {        
    botonEnviar.disabled = false;
  } else {
    botonEnviar.disabled = true;
  }
}

function validarUsuario(correo){
  let eRegular = /^[a-zA-Z0-9._%+-]+@duoc\.cl$/;

  if(correo === ''){
    alert('El correo no puede estar vacio');
    return false;
  } else if(!eRegular.test(correo)){
    alert('El correo debe ser del tipo usuario@duoc.cl');
    return false;
  }
  else if(correo.length > 20 ){
    alert('Importante: el correo no puede superar los 20 caracteres.');
    return false;
  } else if (/\s/.test(correo)) {
  alert('El correo no puede contener espacios.');
  return false;
  }
  return true;
}

function validarNombre(nombre){
   let eRegularNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

   if(!eRegularNombre.test(nombre)){
    alert('El nombre debne contener solo caracteres alfabeticos y espacios.');
      return false;
   }
   return true;
}

function validarContenidoSeguro(contenido) {
  let regex = /[<>]/;
  if (regex.test(contenido)) {
    alert('El mensaje no puede contener < o >');
    return false;
  }
  return true;
}
 
nombre.addEventListener("input", validarFormulario);
correo.addEventListener("input", validarFormulario);
contenido.addEventListener("input", validarFormulario);

formulario.addEventListener("submit", function(e) {
  if (!validarUsuario(correo.value) || !validarNombre(nombre.value) || !validarContenidoSeguro(contenido.value)) {
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
    titulo: id, // si quieres, cámbialo por el asunto
    nombre: nombre.value,
    correo: correo.value,
    descripcion: contenido.value,
    fecha: ahora.toISOString(),
    fechaLocal: ahora.toLocaleDateString(),
    hora: ahora.toLocaleTimeString(),
    estado: "pendiente",
  };

  const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  solicitudes.push(mensaje);
  localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
  localStorage.setItem("solicitudes_seq", String(seqNuevo));

  //  en consola los datos enviados
  console.log("Nombre:", nombre.value);
  console.log("Correo:", correo.value);
  console.log("Contenido:", contenido.value);
  const formData = new FormData(formulario);
  const urlParam = new URLSearchParams(formData);
  const queryString = urlParam.toString();
  console.log("Query string enviado:", queryString);
  alert("¡Mensaje enviado correctamente!");
  formulario.reset();
  validarFormulario();
  e.preventDefault();
});

validarFormulario();