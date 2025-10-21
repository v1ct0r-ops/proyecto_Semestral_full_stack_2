// test/NuevoProductoPanel.spec.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import NuevoProductoPanel from "../src/components/Productos/NuevoProductoPanel.jsx";

describe("NuevoProductoPanel", () => {
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
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipo: "admin" }));

    localStorage.setItem("categorias", JSON.stringify(["audio", "perifericos"]));
    localStorage.setItem("productos", JSON.stringify([]));
  });

  function type(el, value) {
    fireEvent.change(el, { target: { value } });
  }

  it("valida y crea un nuevo producto (persiste en localStorage)", async () => {
    render(
      <MemoryRouter>
        <NuevoProductoPanel />
      </MemoryRouter>
    );

    const iCodigo = await screen.findByLabelText(/código/i);
    const iNombre = screen.getByLabelText(/nombre/i);
    const iPrecio = screen.getByLabelText(/precio/i);
    const iStock = screen.getByLabelText(/stock$/i);
    const sCategoria = screen.getByLabelText(/categoría/i);

    type(iCodigo, "P-123");
    type(iNombre, "Headset Gamer");
    type(iPrecio, "25000");
    type(iStock, "5");
    type(sCategoria, "audio");

    const btnGuardar = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(btnGuardar);

    await waitFor(() => {
      const guardado = screen.getByText(/producto guardado/i);
      expect(guardado).toBeTruthy();
    });

    const lista = JSON.parse(localStorage.getItem("productos") || "[]");
    expect(Array.isArray(lista)).toBeTrue();
    expect(lista.length).toBeGreaterThan(0);

    const nuevo = lista.find((p) => p && p.codigo === "P-123");
    expect(nuevo).toBeDefined();
    expect(nuevo.nombre).toBe("Headset Gamer");
    expect(nuevo.precio).toBe(25000);
    expect(nuevo.stock).toBe(5);
    expect(nuevo.categoria).toBe("audio");
  });
});
