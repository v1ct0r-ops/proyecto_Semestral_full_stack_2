import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import ProductosPanel from "../src/components/Productos/ProductosPanel.jsx";

describe("ProductosPanel (smoke)", () => {
  beforeEach(() => {
    spyOn(window, "alert").and.callFake(() => {});
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}
    localStorage.clear();

    localStorage.setItem("usuarios", JSON.stringify([
      { run:"11.111.111-1", nombres:"Admin", apellidos:"Uno", correo:"admin@duoc.cl", tipoUsuario:"admin" }
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo:"admin@duoc.cl", tipo:"admin" }));

    localStorage.setItem("productos", JSON.stringify([
      { codigo:"X1", nombre:"Pad", precio:5000, stock:10, categoria:"perifericos" }
    ]));
    localStorage.setItem("usuarios", JSON.stringify([{ correo:"admin@duoc.cl" }]));
    localStorage.setItem("pedidos", JSON.stringify([{ estado:"pendiente" }]));
  });

  it("renderiza sin crashear y muestra un producto", async () => {
    render(<MemoryRouter><ProductosPanel /></MemoryRouter>);
    expect(await screen.findByText(/Pad/i)).toBeTruthy();
  });
});
