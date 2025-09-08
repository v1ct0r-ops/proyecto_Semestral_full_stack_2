//necesito saber si el input con id nombre correo y contenido tienen algo escrito
//si tienen algo escrito que el boton de enviar se habilite
//si no tienen nada escrito que el boton de enviar se deshabilite
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
 
nombre.addEventListener("input", validarFormulario);
correo.addEventListener("input", validarFormulario);
contenido.addEventListener("input", validarFormulario);

botonEnviar.addEventListener("click", (e) => {
    console.log("Nombre:", nombre.value);
    console.log("Correo:", correo.value);
    console.log("Contenido:", contenido.value);
    alert("Mensaje enviado");
});


validarFormulario();