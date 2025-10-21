import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jasmine-dom";
import { MemoryRouter } from "react-router-dom";
import SolicitudesPanel from "../src/components/Solicitud/SolicitudesPanel.jsx";

describe("SolicitudesPanel (React)", () => {
  beforeEach(() => {
    spyOn(window, "alert").and.callFake(() => {});
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    localStorage.clear();
    localStorage.setItem("usuarios", JSON.stringify([
      {
        run: "11.111.111-1",
        nombres: "Test",
        apellidos: "Admin",
        correo: "admin@duoc.cl",
        tipoUsuario: "admin",
        puntosLevelUp: 250,
        codigoReferido: "ABC123",
        pass: "admin"
      }
    ]));
    localStorage.setItem("sesion", JSON.stringify({
      correo: "admin@duoc.cl",
      tipo: "admin"
    }));

    localStorage.setItem("solicitudes", JSON.stringify([
      {
        id: "SOL-8",
        titulo: "SOL-8",
        nombre: "Ana",
        correo: "ana@duoc.cl",
        descripcion: "Ayuda",
        fecha: new Date().toISOString(),
        estado: "pendiente",
      },
      {
        id: "SOL-9",
        titulo: "SOL-9",
        nombre: "Luis",
        correo: "luis@duoc.cl",
        descripcion: "Consulta",
        fecha: new Date().toISOString(),
        estado: "resuelto",
      },
    ]));
  });

  it("renderiza las solicitudes guardadas", async () => {
    render(
      <MemoryRouter>
        <SolicitudesPanel />
      </MemoryRouter>
    );

    const sol8 = await screen.findByText("SOL-8");
    const sol9 = await screen.findByText("SOL-9");
    expect(sol8).toBeTruthy();
    expect(sol9).toBeTruthy();
  });

  it("muestra los estados en pantalla", async () => {
    render(
      <MemoryRouter>
        <SolicitudesPanel />
      </MemoryRouter>
    );

    const pendientes = await screen.findAllByText(/PENDIENTE/i);
    expect(pendientes.length).toBeGreaterThan(0);

    const resueltosOEquivalentes = await screen.findAllByText(/RESUELTO|ATENDIDA|COMPLETADO/i);
    expect(resueltosOEquivalentes.length).toBeGreaterThan(0);
  });
});
