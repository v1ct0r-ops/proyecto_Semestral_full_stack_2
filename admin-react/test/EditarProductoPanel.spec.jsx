// Importo React y las herramientas que voy a usar para probar.
import React from "react";

// Traigo utilidades de Testing Library para renderizar y consultar el DOM.
import { render, screen, fireEvent } from "@testing-library/react";

// Extiendo los matchers de Jasmine para trabajar más cómodo con el DOM.
import "@testing-library/jasmine-dom";

// Uso MemoryRouter y las rutas para simular la URL con :codigo.
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Este es el componente que quiero probar: edición de producto.
import EditarProductoPanel from "../src/components/Productos/EditarProductoPanel.jsx";

// Agrupo todas las pruebas del panel de edición.
describe("EditarProductoPanel", () => {

  // Antes de cada test dejo limpio el entorno y preparo datos de ejemplo.
  beforeEach(() => {
    // Desactivo alert para que no moleste durante la ejecución.
    spyOn(window, "alert").and.callFake(() => {});

    // Desactivo las redirecciones y recargas reales del navegador.
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    // Limpio el localStorage para empezar desde cero.
    localStorage.clear();

    // Guardo un usuario admin porque este panel es parte de administración.
    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" }
    ]));

    // Guardo también una sesión activa de tipo admin.
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipo: "admin" }));

    // Cargo un producto inicial (COD-1) que es el que voy a editar.
    localStorage.setItem("productos", JSON.stringify([
      { codigo:"COD-1", nombre:"Teclado TKL", descripcion:"Mecánico", detalles:"RGB", precio:34990, stock:7, stockCritico:3, categoria:"perifericos", imagen:"/img/tkl.png" }
    ]));
  });

  // Caso principal: cargar el producto por :codigo y permitir editarlo.
  it("carga datos del producto por :codigo y permite editar campos", async () => {
    // Renderizo el componente dentro de un MemoryRouter con la ruta del producto.
    render(
      <MemoryRouter initialEntries={["/admin/productos/editar/COD-1"]}>
        <Routes>
          <Route path="/admin/productos/editar/:codigo" element={<EditarProductoPanel />} />
        </Routes>
      </MemoryRouter>
    );

    // Busco el input con el nombre actual del producto.
    const nombre = await screen.findByDisplayValue(/Teclado TKL/i);
    expect(nombre).toBeTruthy();

    // Simulo que edito el nombre cambiándolo a "Teclado 60%".
    fireEvent.change(nombre, { target: { value: "Teclado 60%" } });

    // Localizo el botón Guardar/Actualizar.
    const btnGuardar = screen.getByRole("button", { name: /guardar|actualizar/i });

    // Hago click para guardar los cambios.
    fireEvent.click(btnGuardar);

    // Espero ver un mensaje de confirmación de que se guardó correctamente.
    expect(await screen.findByText(/guardado|actualizado|éxito/i)).toBeTruthy();
  });
});
