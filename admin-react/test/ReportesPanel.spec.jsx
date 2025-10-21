// Importo React porque lo necesito para renderizar el componente
import React from "react";
// Importo render, screen, fireEvent y within de testing-library para probar el DOM y simular interacciones
import { render, screen, fireEvent, within } from "@testing-library/react";
// Extiendo jasmine-dom para tener más matchers útiles en las pruebas
import "@testing-library/jasmine-dom";
// Uso MemoryRouter para simular rutas en las pruebas
import { MemoryRouter } from "react-router-dom";
// Importo el componente a testear: ReportesPanel
import ReportesPanel from "../src/components/Reportes/ReportesPanel.jsx";

// Agrupo las pruebas que corresponden al ReportesPanel
describe("ReportesPanel", () => {
  // Antes de cada prueba preparo el entorno
  beforeEach(() => {
    // Evito alert y navegación real para que no interrumpan el test
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try {
      Object.defineProperty(window, "location", {
        value: { href: "", assign: () => {}, replace: () => {}, reload: () => {} },
        writable: true,
      });
    } catch {}

    // Simulo el portapapeles en caso de que el panel lo necesite
    if (!navigator.clipboard) {
      // @ts-ignore
      navigator.clipboard = { writeText: () => Promise.resolve() };
    }

    // Limpio el localStorage
    localStorage.clear();

    // Guardo un usuario admin y la sesión activa
    localStorage.setItem("usuarios", JSON.stringify([
      { run: "11.111.111-1", nombres: "Admin", apellidos: "Uno", correo: "admin@duoc.cl", tipoUsuario: "admin" },
    ]));
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl" }));

    // Cargo productos de ejemplo en el localStorage
    localStorage.setItem("productos", JSON.stringify([
      { codigo: "P1", nombre: "Headset", precio: 20000, stock: 3,  categoria: "audio" },
      { codigo: "P2", nombre: "Mouse",   precio: 10000, stock: 12, categoria: "perifericos" },
    ]));

    // Cargo pedidos simulados en el localStorage
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

  // Caso de prueba: filtrar boletas y calcular productos críticos según umbral
  it("filtra boletas por término y calcula críticos por umbral", async () => {
    // Renderizo el panel de reportes dentro de MemoryRouter
    const { container } = render(
      <MemoryRouter>
        <ReportesPanel />
      </MemoryRouter>
    );

    // --- Sección Órdenes/Boletas ---
    // Busco la tarjeta de boletas y obtengo su contenedor
    const cardBoletas = within(
      (await screen.findByText(/Órdenes\s*\/\s*Boletas/i)).closest(".tarjeta")
    );
    // Localizo el input de búsqueda por su placeholder
    const inputBoleta = cardBoletas.getByPlaceholderText(/Buscar por ID, RUN o correo/i);
    // Simulo escribir "B-100" en el input
    fireEvent.change(inputBoleta, { target: { value: "B-100" } });

    // Verifico que B-100 aparece y B-101 queda filtrado
    expect(await cardBoletas.findByText(/B-100/i)).toBeTruthy();
    expect(cardBoletas.queryByText(/B-101/i)).toBeNull();

    // --- Sección Productos críticos ---
    // Busco la tarjeta de productos críticos
    const cardCriticos = within(
      screen.getByText(/Listado de productos críticos/i).closest(".tarjeta")
    );
    // Localizo el input del umbral (es un spinbutton)
    const umbralInput = cardCriticos.getAllByRole("spinbutton")[0];
    // Simulo que cambio el umbral a 5
    fireEvent.change(umbralInput, { target: { value: "5" } });

    // Con umbral 5, el Headset (stock 3) debe aparecer, el Mouse (stock 12) no
    expect(await cardCriticos.findByText(/Headset/i)).toBeTruthy();
    expect(cardCriticos.queryByText(/\bMouse\b/i)).toBeNull();
  });
});
