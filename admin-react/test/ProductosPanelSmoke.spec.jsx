// Importo React porque lo necesito para renderizar el componente
import React from "react";
// Importo render y screen de testing-library para probar lo que se muestra en pantalla
import { render, screen } from "@testing-library/react";
// Agrego la extensión de jasmine-dom para tener más matchers
import "@testing-library/jasmine-dom";
// Uso MemoryRouter para simular la navegación en los tests
import { MemoryRouter } from "react-router-dom";
// Importo el componente que quiero probar, en este caso ProductosPanel
import ProductosPanel from "../src/components/Productos/ProductosPanel.jsx";

// Agrupo las pruebas de smoke test para ProductosPanel
describe("ProductosPanel (smoke)", () => {
  // Antes de cada prueba preparo el entorno
  beforeEach(() => {
    // Desactivo alert y redirecciones reales que puedan romper la prueba
    spyOn(window, "alert").and.callFake(() => {});
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    // Limpio el localStorage
    localStorage.clear();

    // Guardo un usuario admin para que el guard del panel funcione
    localStorage.setItem("usuarios", JSON.stringify([
      { run:"11.111.111-1", nombres:"Admin", apellidos:"Uno", correo:"admin@duoc.cl", tipoUsuario:"admin" }
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo:"admin@duoc.cl", tipo:"admin" }));

    // Cargo un producto de ejemplo para que se muestre en el panel
    localStorage.setItem("productos", JSON.stringify([
      { codigo:"X1", nombre:"Pad", precio:5000, stock:10, categoria:"perifericos" }
    ]));

    // También guardo usuarios y pedidos de prueba mínimos
    localStorage.setItem("usuarios", JSON.stringify([{ correo:"admin@duoc.cl" }]));
    localStorage.setItem("pedidos", JSON.stringify([{ estado:"pendiente" }]));
  });

  // Caso de prueba: verificar que renderiza sin romper y muestra el producto cargado
  it("renderiza sin crashear y muestra un producto", async () => {
    // Renderizo el panel dentro de un MemoryRouter
    render(<MemoryRouter><ProductosPanel /></MemoryRouter>);
    // Verifico que el producto 'Pad' aparezca en la pantalla
    expect(await screen.findByText(/Pad/i)).toBeTruthy();
  });
});
