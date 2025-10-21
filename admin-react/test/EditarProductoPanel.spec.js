import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditarProductoPanel from "../src/components/Productos/EditarProductoPanel.jsx";

describe("EditarProductoPanel", () => {
  beforeEach(() => {
    spyOn(window, "alert").and.callFake(() => {});
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}
    localStorage.clear();

    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" }
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipo: "admin" }));

    localStorage.setItem("productos", JSON.stringify([
      { codigo:"COD-1", nombre:"Teclado TKL", descripcion:"Mecánico", detalles:"RGB", precio:34990, stock:7, stockCritico:3, categoria:"perifericos", imagen:"/img/tkl.png" }
    ]));
  });

  it("carga datos del producto por :codigo y permite editar campos", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/productos/editar/COD-1"]}>
        <Routes>
          <Route path="/admin/productos/editar/:codigo" element={<EditarProductoPanel />} />
        </Routes>
      </MemoryRouter>
    );

    const nombre = await screen.findByDisplayValue(/Teclado TKL/i);
    expect(nombre).toBeTruthy();

    fireEvent.change(nombre, { target: { value: "Teclado 60%" } });
    const btnGuardar = screen.getByRole("button", { name: /guardar|actualizar/i });
    fireEvent.click(btnGuardar);

    expect(await screen.findByText(/guardado|actualizado|éxito/i)).toBeTruthy();
  });
});
