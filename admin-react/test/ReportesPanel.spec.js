// test/ReportesPanel.spec.jsx
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import ReportesPanel from "../src/components/Reportes/ReportesPanel.jsx";

describe("ReportesPanel", () => {
  beforeEach(() => {
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try {
      Object.defineProperty(window, "location", {
        value: { href: "", assign: () => {}, replace: () => {}, reload: () => {} },
        writable: true,
      });
    } catch {}
    if (!navigator.clipboard) {
      navigator.clipboard = { writeText: () => Promise.resolve() };
    }

    localStorage.clear();

    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" },
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl" }));
    localStorage.setItem("productos", JSON.stringify([
      { codigo: "P1", nombre: "Headset", precio: 20000, stock: 3,  categoria: "audio" },
      { codigo: "P2", nombre: "Mouse",   precio: 10000, stock: 12, categoria: "perifericos" },
    ]));
    localStorage.setItem("pedidos", JSON.stringify([
      {
        id: "B-100",
        estado: "pendiente",
        fecha: new Date().toISOString(),
        comprador: { correo: "c1@duoc.cl", run: "22.222.222-2" },
        items: [{ codigo: "P1", nombre: "Headset", precio: 20000, cantidad: 1 }],
      },
      {
        id: "B-101",
        estado: "despachado",
        fecha: new Date().toISOString(),
        comprador: { correo: "c2@duoc.cl", run: "33.333.333-3" },
        items: [{ codigo: "P2", nombre: "Mouse", precio: 10000, cantidad: 2 }],
      },
    ]));
  });

  it("filtra boletas por término y calcula críticos por umbral", async () => {
    const { container } = render(
      <MemoryRouter>
        <ReportesPanel />
      </MemoryRouter>
    );

    const cardBoletas = within(
      (await screen.findByText(/Órdenes\s*\/\s*Boletas/i)).closest(".tarjeta")
    );
    const inputBoleta = cardBoletas.getByPlaceholderText(/Buscar por ID, RUN o correo/i);
    fireEvent.change(inputBoleta, { target: { value: "B-100" } });

    expect(await cardBoletas.findByText(/B-100/i)).toBeTruthy();
    expect(cardBoletas.queryByText(/B-101/i)).toBeNull(); 

    const cardCriticos = within(
      screen.getByText(/Listado de productos críticos/i).closest(".tarjeta")
    );
    const umbralInput = cardCriticos.getAllByRole("spinbutton")[0];
    fireEvent.change(umbralInput, { target: { value: "5" } });
    
    expect(await cardCriticos.findByText(/Headset/i)).toBeTruthy();
    expect(cardCriticos.queryByText(/\bMouse\b/i)).toBeNull();
  });
});
