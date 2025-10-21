// test/NuevoProductoPanel.spec.jsx
// Importo React y lo que necesito para probar.
import React from "react";
// Traigo de Testing Library las funciones para renderizar y consultar el DOM.
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Agrego matchers útiles para trabajar con el DOM.
import "@testing-library/jasmine-dom";
// Uso MemoryRouter para simular la navegación en las pruebas.
import { MemoryRouter } from "react-router-dom";
// Este es el componente que voy a probar: alta de producto.
import NuevoProductoPanel from "../src/components/Productos/NuevoProductoPanel.jsx";

// Agrupo los tests del panel de nuevo producto.
describe("NuevoProductoPanel", () => {
  // Antes de cada test dejo todo limpio y preparo los datos base.
  beforeEach(() => {
    // Evita navegaciones/alerts reales en Karma
    // Desactivo alert para que no moleste durante el test.
    try { spyOn(window, "alert").and.callFake(() => {}); } catch {}
    try {
      // Evito que el componente navegue de verdad (mock de window.location).
      Object.defineProperty(window, "location", {
        value: { href: "", assign: () => {}, replace: () => {} },
        writable: true,
      });
    } catch {}

    // mock mínimo del clipboard que usa el panel de cuenta
    if (!navigator.clipboard) {
      // @ts-ignore
      // Mock sencillo del clipboard por si el componente lo usa.
      navigator.clipboard = { writeText: () => Promise.resolve() };
    }

    // Limpio el storage para empezar desde cero.
    localStorage.clear();

    // Usuario admin + sesión coherente con usuarioActual()
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
    // Guardo una sesión activa de tipo admin.
    localStorage.setItem("sesion", JSON.stringify({ correo: "admin@duoc.cl", tipo: "admin" }));

    // Semilla de datos que usa el componente
    // Opción A: proveer categorías directamente
    // Cargo categorías válidas para el formulario.
    localStorage.setItem("categorias", JSON.stringify(["audio", "perifericos"]));
    // Opción B (alternativa): derivarlas de productos existentes
    // Arranco sin productos para validar la creación.
    localStorage.setItem("productos", JSON.stringify([]));
  });

  // Pequeña ayuda para escribir en los inputs como si tipeara.
  function type(el, value) {
    fireEvent.change(el, { target: { value } });
  }

  // Caso principal: valido y creo un producto nuevo guardándolo en localStorage.
  it("valida y crea un nuevo producto (persiste en localStorage)", async () => {
    // Renderizo el panel dentro de un MemoryRouter.
    render(
      <MemoryRouter>
        <NuevoProductoPanel />
      </MemoryRouter>
    );

    // Campos por label (están asociados con htmlFor en el componente)
    // Busco el input de Código (viene asociado por label).
    const iCodigo = await screen.findByLabelText(/código/i);
    // Tomo el input de Nombre.
    const iNombre = screen.getByLabelText(/nombre/i);
    // Tomo el input de Precio.
    const iPrecio = screen.getByLabelText(/precio/i);
    // Tomo el input de Stock (no el de Stock Crítico).
    const iStock = screen.getByLabelText(/stock$/i); // el de 'Stock', no 'Stock Crítico'
    // Tomo el select de Categoría.
    const sCategoria = screen.getByLabelText(/categoría/i);

    // Rellenar formulario
    // Escribo el código del nuevo producto.
    type(iCodigo, "P-123");
    // Escribo el nombre.
    type(iNombre, "Headset Gamer");
    // Escribo el precio (texto que luego el componente parsea).
    type(iPrecio, "25000");
    // Escribo el stock inicial.
    type(iStock, "5");
    // seleccionar categoría válida (sembrada arriba)
    // Selecciono una categoría válida de las que sembré.
    type(sCategoria, "audio");

    // Enviar
    // Busco el botón Guardar.
    const btnGuardar = screen.getByRole("button", { name: /guardar/i });
    // Hago click para enviar el formulario.
    fireEvent.click(btnGuardar);

    // Debe mostrar mensaje OK y persistir en localStorage
    // Espero el mensaje de confirmación en pantalla.
    await waitFor(() => {
      // Verifico que el texto de éxito esté presente.
      const guardado = screen.getByText(/producto guardado/i);
      expect(guardado).toBeTruthy();
    });

    // Verificar almacenamiento
    // Leo la lista de productos que debería haberse actualizado.
    const lista = JSON.parse(localStorage.getItem("productos") || "[]");
    // Confirmo que tengo un arreglo válido.
    expect(Array.isArray(lista)).toBeTrue();
    // Debe haber al menos un producto guardado.
    expect(lista.length).toBeGreaterThan(0);

    // Busco el producto recién creado por su código.
    const nuevo = lista.find((p) => p && p.codigo === "P-123");
    // Confirmo que lo encontré.
    expect(nuevo).toBeDefined();
    // Verifico nombre correcto.
    expect(nuevo.nombre).toBe("Headset Gamer");
    // Verifico precio como número (el componente lo parsea).
    expect(nuevo.precio).toBe(25000);
    // Verifico stock como número.
    expect(nuevo.stock).toBe(5);
    // Verifico la categoría seleccionada.
    expect(nuevo.categoria).toBe("audio");
  });
});