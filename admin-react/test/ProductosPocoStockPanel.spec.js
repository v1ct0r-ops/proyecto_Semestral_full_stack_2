// test/ProductosPocoStockPanel.spec.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import ProductosPocoStockPanel from "../src/components/Productos/ProductosPocoStockPanel.jsx";

describe("ProductosPocoStockPanel", () => {
  beforeEach(() => {
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try {
      Object.defineProperty(window, "location", {
        value: { href: "", assign: () => {}, replace: () => {} },
        writable: true,
      });
    } catch {}

    if (!navigator.clipboard) {
      navigator.clipboard = { writeText: () => Promise.resolve() };
    }

    localStorage.clear();
    localStorage.setItem(
      "usuarios",
      JSON.stringify([
        {
          run: "11.111.111-1",
          nombres: "Admin",
          apellidos: "Uno",
          correo: "admin@duoc.cl",
          tipoUsuario: "admin",
          puntosLevelUp: 0,
          codigoReferido: "REF123",
        },
      ])
    );
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipoUsuario: "admin" }));

    localStorage.setItem(
      "productos",
      JSON.stringify([
        { codigo: "X1", nombre: "Teclado",  stock: 2, stockCritico: 5, categoria: "perifericos", precio: 10000 },
        { codigo: "X2", nombre: "Mouse",    stock: 5, stockCritico: 5, categoria: "perifericos", precio:  8000 },
        { codigo: "X3", nombre: "Parlante", stock: 7, stockCritico: 5, categoria: "audio",       precio: 15000 },
      ])
    );
  });

  it("muestra SOLO productos con stock <= stockCritico y los ordena por stock ascendente", async () => {
    const { container } = render(
      <MemoryRouter>
        <ProductosPocoStockPanel />
      </MemoryRouter>
    );

    expect(await screen.findByText("X1")).toBeTruthy();
    expect(await screen.findByText("X2")).toBeTruthy();
    expect(screen.queryByText("X3")).toBeNull(); 

    const rowX1 = screen.getByText("X1").closest("tr");
    const rowX2 = screen.getByText("X2").closest("tr");
    expect(rowX1).toBeTruthy();
    expect(rowX2).toBeTruthy();
    expect(rowX1.rowIndex).toBeLessThan(rowX2.rowIndex);

    expect(rowX1.textContent).toMatch(/Teclado/i);
    expect(rowX2.textContent).toMatch(/Mouse/i);

    const critCells = container.querySelectorAll("td.stock-critico");
    expect(critCells.length).toBeGreaterThan(0);
  });

  it("muestra mensaje de vacío cuando no hay productos críticos", async () => {
    localStorage.setItem(
      "productos",
      JSON.stringify([
        { codigo: "N1", nombre: "Silla", stock: 10, stockCritico: 5, categoria: "muebles", precio: 30000 },
      ])
    );

    render(
      <MemoryRouter>
        <ProductosPocoStockPanel />
      </MemoryRouter>
    );

    const vacio = await screen.findByText(/no hay productos en nivel crítico/i);
    expect(vacio).toBeTruthy();
  });
});
