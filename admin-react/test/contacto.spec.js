// Importo el script de contacto que quiero probar
import "../src/site/contacto.js";

// Función auxiliar para montar el formulario en el DOM de prueba
function mountForm() {
  document.body.innerHTML = `
    <form class="form-contacto">
      <input id="nombre" />
      <input id="correo" />
      <textarea id="contenido"></textarea>
      <button id="btnEnviar" disabled>Enviar</button>
    </form>
  `;
}

// Agrupo todas las pruebas que corresponden al formulario de contacto
describe("contacto.js (formulario de contacto)", () => {
  // Antes de todas las pruebas importo el módulo una sola vez
  beforeAll(() => {
    require("../src/site/contacto.js");
  });

  // Antes de cada prueba limpio y preparo el DOM
  beforeEach(() => {
    // Borro el localStorage para empezar en limpio
    localStorage.clear();
    // Desactivo alert para que no aparezca en el test
    spyOn(window, "alert").and.callFake(() => {});
    // Montar el formulario en el body
    mountForm();

    // Inicializo los listeners definidos en el script de contacto
    if (typeof window.__initContacto === "function") {
      window.__initContacto();
    }
  });

  // Caso 1: verificar que el botón se habilita cuando todos los campos son válidos
  it("deshabilita y habilita el botón según campos", () => {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const contenido = document.getElementById("contenido");
    const btn = document.getElementById("btnEnviar");

    // Al inicio debería estar deshabilitado
    expect(btn.disabled).toBeTrue();

    // Completo los campos con valores válidos
    nombre.value = "Juan";
    correo.value = "juan@duoc.cl";
    contenido.value = "Hola mundo";

    // Disparo eventos input para que corra la validación
    nombre.dispatchEvent(new Event("input", { bubbles: true }));
    correo.dispatchEvent(new Event("input", { bubbles: true }));
    contenido.dispatchEvent(new Event("input", { bubbles: true }));

    // Ahora el botón debería estar habilitado
    expect(btn.disabled).toBeFalse();
  });

  // Caso 2: al enviar debe guardar la solicitud y aumentar el contador
  it("al enviar guarda SOL-1 y aumenta el contador", () => {
    const form = document.querySelector(".form-contacto");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const contenido = document.getElementById("contenido");
    const btn = document.getElementById("btnEnviar");

    // Completo el formulario con valores válidos
    nombre.value = "Ana";
    correo.value = "ana@duoc.cl";
    contenido.value = "Necesito ayuda";
    nombre.dispatchEvent(new Event("input", { bubbles: true }));
    correo.dispatchEvent(new Event("input", { bubbles: true }));
    contenido.dispatchEvent(new Event("input", { bubbles: true }));

    // El botón se habilita
    expect(btn.disabled).toBeFalse();

    // Simulo el envío del formulario
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    // Reviso que se haya guardado una solicitud en localStorage
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    const seq = localStorage.getItem("solicitudes_seq");

    // Debe existir una solicitud con ID y título "SOL-1"
    expect(solicitudes.length).toBe(1);
    expect(solicitudes[0].id).toBe("SOL-1");
    expect(solicitudes[0].titulo).toBe("SOL-1");
    // El contador interno debe haberse incrementado a 1
    expect(seq).toBe("1");
  });
});
