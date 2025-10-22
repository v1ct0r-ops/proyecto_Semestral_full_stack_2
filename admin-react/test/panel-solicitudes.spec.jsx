// Importo React y las utilidades que necesito para hacer las pruebas.
import React from "react";
import { render, screen, within } from "@testing-library/react";

// Agrego los matchers de Jasmine para trabajar con el DOM.
import "@testing-library/jasmine-dom";

// Uso MemoryRouter para simular la navegación en las pruebas.
import { MemoryRouter } from "react-router-dom";

// Este es el componente que voy a probar: SolicitudesPanel.
import SolicitudesPanel from "../src/components/Solicitud/SolicitudesPanel.jsx";

// Agrupo todas las pruebas del panel de solicitudes.
describe("SolicitudesPanel (React)", () => {

  // Antes de cada prueba preparo el entorno limpio y con datos de ejemplo.
  beforeEach(() => {
    // Desactivo alert y navegación para que no molesten en las pruebas.
    spyOn(window, "alert").and.callFake(() => {});
    try { spyOn(window.location, "assign").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "replace").and.callFake(() => {}); } catch {}
    try { spyOn(window.location, "reload").and.callFake(() => {}); } catch {}
    try { spyOnProperty(window.location, "href", "set").and.callFake(() => {}); } catch {}

    // Limpio el localStorage para empezar desde cero.
    localStorage.clear();

    // Guardo un usuario admin y la sesión para que el guard lo deje pasar.
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

    // Cargo solicitudes de ejemplo, una pendiente y otra resuelta.
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

  // Caso 1: reviso que se muestren las solicitudes guardadas.
  it("renderiza las solicitudes guardadas", async () => {
    render(
      <MemoryRouter>
        <SolicitudesPanel />
      </MemoryRouter>
    );

    // Busco que aparezcan los títulos SOL-8 y SOL-9 en la pantalla.
    const sol8 = await screen.findByText("SOL-8");
    const sol9 = await screen.findByText("SOL-9");
    expect(sol8).toBeTruthy();
    expect(sol9).toBeTruthy();
  });

  // Caso 2: reviso que se muestren los estados de las solicitudes.
  it("muestra los estados en pantalla", async () => {
    render(
      <MemoryRouter>
        <SolicitudesPanel />
      </MemoryRouter>
    );

    // Busco que haya al menos una solicitud pendiente.
    const pendientes = await screen.findAllByText(/PENDIENTE/i);
    expect(pendientes.length).toBeGreaterThan(0);

    // Busco que también aparezca algún resuelto o equivalente.
    const resueltosOEquivalentes = await screen.findAllByText(/RESUELTO|ATENDIDA|COMPLETADO/i);
    expect(resueltosOEquivalentes.length).toBeGreaterThan(0);

    // También podría acotar la búsqueda dentro de la lista si quisiera ser más específico.
  });
});
