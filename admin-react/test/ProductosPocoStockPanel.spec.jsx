// Importo React para poder renderizar el componente
import React from "react";
// Uso render y screen de testing-library para interactuar con el DOM
import { render, screen } from "@testing-library/react";
// Extiendo los matchers de Jasmine para tener más opciones al verificar
import "@testing-library/jasmine-dom";
// Uso MemoryRouter para simular navegación sin un navegador real
import { MemoryRouter } from "react-router-dom";
// Componente a testear: lista de productos con poco stock
import ProductosPocoStockPanel from "../src/components/Productos/ProductosPocoStockPanel.jsx";

// Agrupo todas las pruebas del panel de productos con poco stock
describe("ProductosPocoStockPanel", () => {
  // Antes de cada test preparo el entorno
  beforeEach(() => {
    // Evito alert y redirecciones reales que rompan el test
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try {
      Object.defineProperty(window, "location", {
        value: { href: "", assign: () => {}, replace: () => {} },
        writable: true,
      });
    } catch {}

    // Simulo el portapapeles para que no falle si el panel lo usa
    if (!navigator.clipboard) {
      // @ts-ignore
      navigator.clipboard = { writeText: () => Promise.resolve() };
    }

    // Limpio el localStorage
    localStorage.clear();

    // Dejo un usuario admin en la sesión
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

    // Cargo productos de ejemplo
    // X1: crítico (2 <= 5)
    // X2: crítico (5 <= 5)
    // X3: no crítico (7 > 5)
    localStorage.setItem(
      "productos",
      JSON.stringify([
        { codigo: "X1", nombre: "Teclado",  stock: 2, stockCritico: 5, categoria: "perifericos", precio: 10000 },
        { codigo: "X2", nombre: "Mouse",    stock: 5, stockCritico: 5, categoria: "perifericos", precio:  8000 },
        { codigo: "X3", nombre: "Parlante", stock: 7, stockCritico: 5, categoria: "audio",       precio: 15000 },
      ])
    );
  });

  // Caso 1: se deben mostrar solo los críticos, ordenados por stock ascendente
  it("muestra SOLO productos con stock <= stockCritico y los ordena por stock ascendente", async () => {
    // Renderizo el panel dentro de MemoryRouter
    const { container } = render(
      <MemoryRouter>
        <ProductosPocoStockPanel />
      </MemoryRouter>
    );

    // Espero ver solo X1 y X2
    expect(await screen.findByText("X1")).toBeTruthy();
    expect(await screen.findByText("X2")).toBeTruthy();
    expect(screen.queryByText("X3")).toBeNull(); // no crítico: no debe aparecer

    // Verifico que X1 aparece antes que X2 en la tabla
    const rowX1 = screen.getByText("X1").closest("tr");
    const rowX2 = screen.getByText("X2").closest("tr");
    expect(rowX1).toBeTruthy();
    expect(rowX2).toBeTruthy();
    expect(rowX1.rowIndex).toBeLessThan(rowX2.rowIndex);

    // Reviso que se muestre la información básica
    expect(rowX1.textContent).toMatch(/Teclado/i);
    expect(rowX2.textContent).toMatch(/Mouse/i);

    // También verifico que se use la clase CSS de stock crítico
    const critCells = container.querySelectorAll("td.stock-critico");
    expect(critCells.length).toBeGreaterThan(0);
  });

  // Caso 2: cuando no hay productos críticos debe aparecer un mensaje
  it("muestra mensaje de vacío cuando no hay productos críticos", async () => {
    // Sobrescribo los productos con uno que no es crítico
    localStorage.setItem(
      "productos",
      JSON.stringify([
        { codigo: "N1", nombre: "Silla", stock: 10, stockCritico: 5, categoria: "muebles", precio: 30000 },
      ])
    );

    // Renderizo el panel
    render(
      <MemoryRouter>
        <ProductosPocoStockPanel />
      </MemoryRouter>
    );

    // Debe aparecer un mensaje de que no hay productos críticos
    const vacio = await screen.findByText(/no hay productos en nivel crítico/i);
    expect(vacio).toBeTruthy();
  });
});
