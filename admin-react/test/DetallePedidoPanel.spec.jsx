//Importo React y las herramientas que voy a usar para probar.
import React from "react";

//Tomo utilidades de Testing Library para renderizar y consultar el DOM.
import { render, screen, fireEvent } from "@testing-library/react";

//Extiendo los matchers de Jasmine para trabajar cómodo con el DOM.
import "@testing-library/jasmine-dom";

//Uso MemoryRouter y las rutas para simular la URL con :codigo.
import { MemoryRouter, Routes, Route } from "react-router-dom";

//Este es el componente que voy a testear: edición de producto.
import EditarProductoPanel from "../src/components/Productos/EditarProductoPanel.jsx";



//Agrupo las pruebas del panel de edición.
describe("EditarProductoPanel", () => {

//Antes de cada prueba dejo el entorno limpio y con datos de ejemplo.
  beforeEach(() => {

//Mockeo window.alert para que no aparezcan popups en medio del test.
    spyOn(window, "alert").and.callFake(() => {});

//También desactivo redirecciones reales del navegador.
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}

//Evito que replace navegue de verdad durante la prueba.
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}

//Bloqueo reload para que no recargue la página del runner.
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}

//Hago spy del setter de href por si el componente intenta navegar.
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

//Limpio el storage para no heredar datos de otras pruebas.
    localStorage.clear();

//Dejo un usuario admin porque el panel es parte del área de administración.
    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" }

    ]));

//Guardo una sesión activa compatible con el flujo (tipo admin).
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipo: "admin" }));

//Cargo un producto inicial (COD-1) que es el que voy a editar.
    localStorage.setItem("productos", JSON.stringify([
      { codigo:"COD-1", nombre:"Teclado TKL", descripcion:"Mecánico", detalles:"RGB", precio:34990, stock:7, stockCritico:3, categoria:"perifericos", imagen:"/img/tkl.png" }
    ]));
  });

//Caso de prueba principal: cargar por :codigo y poder editar/guardar.
  it("carga datos del producto por :codigo y permite editar campos", async () => {

//Renderizo el componente dentro de un MemoryRouter con la ruta que incluye el código.
    render(

//Fijo la URL inicial simulando que entro a /admin/productos/editar/COD-1.
      <MemoryRouter initialEntries={["/admin/productos/editar/COD-1"]}>
        <Routes>
          <Route path="/admin/productos/editar/:codigo" element={<EditarProductoPanel />} />
        </Routes>
      </MemoryRouter>
    );


// Debe mostrar el nombre actual
//Busco el input que ya debería venir con el nombre actual del producto.
    const nombre = await screen.findByDisplayValue(/Teclado TKL/i);

//Confirmo que efectivamente se encontró el campo con el valor inicial.
    expect(nombre).toBeTruthy();

// Edita y simula guardar (según tu UI: busca un botón Guardar/Actualizar)
//Simulo que cambio el nombre por uno nuevo.
    fireEvent.change(nombre, { target: { value: "Teclado 60%" } });

//Localizo el botón que en tu UI corresponde a Guardar/Actualizar.
    const btnGuardar = screen.getByRole("button", { name: /guardar|actualizar/i });

//Hago click para disparar el guardado.
    fireEvent.click(btnGuardar);

// Mensaje de éxito u otra confirmación (ajusta al texto real)
//Espero ver algún mensaje de confirmación para saber que se guardó.
    expect(await screen.findByText(/guardado|actualizado|éxito/i)).toBeTruthy();
  });
});
