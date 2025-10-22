// test/DetallePedidoPanel.spec.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetallePedidoPanel from "../src/components/Pedidos/DetallePedidoPanel.jsx";

describe("DetallePedidoPanel", () => {
  beforeEach(() => {

    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    localStorage.clear();

    localStorage.setItem("usuarios", JSON.stringify([
      {
        run: "11.111.111-1",
        nombres: "Admin",
        apellidos: "Uno",
        correo: "admin@duoc.cl",
        tipoUsuario: "admin",
        puntosLevelUp: 250,
        codigoReferido: "ABC123",
      }
    ]));

    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipoUsuario: "admin" }));

    localStorage.setItem("productos", JSON.stringify([
      { codigo: "AC002", nombre: "HyperX Cloud II", precio: 25000, stock: 10, categoria: "Accesorios" },
    ]));

    localStorage.setItem("pedidos", JSON.stringify([
      {
        id: "PED-9",
        estado: "despachado",
        fecha: new Date().toISOString(),
        comprador: { correo: "user@duoc.cl", run: "22.222.222-2" },
        items: [{ codigo: "AC002", precio: 25000, cantidad: 1 }],
      }
    ]));
  });

  it("renderiza el detalle por :id y muestra estado en el título", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/pedidos/PED-9"]}>
        <Routes>
          <Route path="/admin/pedidos/:id" element={<DetallePedidoPanel />} />
        </Routes>
      </MemoryRouter>
    );

    const h1 = await screen.findByRole("heading", {
      level: 1,
      name: /Pedido\s+PED-9\s+—\s+DESPACHADO/i,
    });
    expect(h1).toBeTruthy();               // Jasmine
    expect(h1.textContent).toMatch(/PED-9/i);
    expect(h1.textContent).toMatch(/DESPACHADO/i);

    const itemNombre = await screen.findByText(/HyperX Cloud II/i);
    expect(itemNombre).toBeTruthy();       // Jasmine

    const btnDespachado = await screen.findByRole("button", { name: /pedido despachado/i });
    expect(btnDespachado).toBeTruthy();    // existe
    expect(btnDespachado.disabled).toBeTrue(); 
  });
});
