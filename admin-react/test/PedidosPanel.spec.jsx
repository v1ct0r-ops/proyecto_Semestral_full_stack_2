// Importo React porque lo necesito para poder renderizar el componente
import React from "react";
// Importo render y screen de testing-library para poder probar lo que se muestra en pantalla
import { render, screen } from "@testing-library/react";
// Importo la extensión de jasmine-dom para tener matchers adicionales en las pruebas
import "@testing-library/jasmine-dom";
// Importo MemoryRouter para simular la navegación de react-router en los tests
import { MemoryRouter } from "react-router-dom";

// Importo el componente que quiero testear, en este caso el panel de pedidos
import PedidosPanel from "../src/components/Pedidos/PedidosPanel.jsx";

// Describo el grupo de pruebas que corresponde a PedidosPanel
describe("PedidosPanel", () => {
  // Antes de cada prueba hago una configuración inicial
  beforeEach(() => {
    // Evito que los alerts o redirecciones de window rompan los tests
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    // Limpio el localStorage para no tener datos viejos
    localStorage.clear();

    // Simulo un usuario administrador en sesión para que el panel funcione
    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" }
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipoUsuario: "admin" }));

    // Cargo algunos pedidos de ejemplo en el localStorage para que el componente los muestre
    localStorage.setItem("pedidos", JSON.stringify([
      {
        id: "PED-1",
        estado: "pendiente",
        fecha: new Date().toISOString(),
        items: [{ codigo: "AC001", precio: 10000, cantidad: 1 }],
        comprador: { correo: "c1@duoc.cl" }
      },
      {
        id: "PED-2",
        estado: "despachado",
        fecha: new Date().toISOString(),
        items: [{ codigo: "AC002", precio: 8000,  cantidad: 2 }],
        comprador: { correo: "c2@duoc.cl" }
      }
    ]));
  });

  // Caso de prueba: verificar que el panel renderiza los pedidos y muestra los estados
  it("renderiza pedidos y mapea estados", async () => {
    // Renderizo el componente dentro de un MemoryRouter porque depende de react-router
    render(
      <MemoryRouter>
        <PedidosPanel />
      </MemoryRouter>
    );

    // Busco los IDs de los pedidos en pantalla
    const p1 = await screen.findByText(/PED-1/i);
    const p2 = await screen.findByText(/PED-2/i);
    // Me aseguro que realmente aparezcan
    expect(p1).toBeTruthy();
    expect(p2).toBeTruthy();

    // Verifico que se muestren los estados normalizados (Pendiente, Despachado, Cancelado)
    const estados = await screen.findAllByText(/Pendiente|Despachado|Cancelado/i);
    expect(estados.length).toBeGreaterThan(0);
  });
});
