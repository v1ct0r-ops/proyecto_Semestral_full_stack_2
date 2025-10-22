// test/PedidosPanel.spec.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import PedidosPanel from "../src/components/Pedidos/PedidosPanel.jsx";

describe("PedidosPanel", () => {
  beforeEach(() => {
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    localStorage.clear();

    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" }
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipoUsuario: "admin" }));
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

  it("renderiza pedidos y mapea estados", async () => {
    render(
      <MemoryRouter>
        <PedidosPanel />
      </MemoryRouter>
    );

    const p1 = await screen.findByText(/PED-1/i);
    const p2 = await screen.findByText(/PED-2/i);
    expect(p1).toBeTruthy();
    expect(p2).toBeTruthy();

    const estados = await screen.findAllByText(/Pendiente|Despachado|Cancelado/i);
    expect(estados.length).toBeGreaterThan(0);
  });
});
