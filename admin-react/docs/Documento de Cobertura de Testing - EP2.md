# Documento de Cobertura de Testing – Evaluación Parcial 2 (Frontend React)

**Proyecto:** Tienda Online – Panel Administrativo y Tienda  
**Alcance:** Pruebas unitarias con **Jasmine + Karma** y **@testing-library/react** sobre componentes clave del frontend.  
**Entrega:** Documento de cobertura que valida el alcance de los elementos cubiertos por los tests, de acuerdo con las instrucciones y rúbrica institucional.  

---

## 1. Contexto y lineamientos institucionales

- La EP2 exige **crear pruebas unitarias para los componentes frontend** (render, props, estado, eventos y DOM) usando **Jasmine y Karma**; además, **implementar un proceso de testeo** que abarque configuración, mocks y análisis de resultados. fileciteturn0file0L52-L80  
- La **entrega** solicita explícitamente un **Documento de cobertura de testing** que **valide el alcance** de lo cubierto. fileciteturn0file0L119-L132  
- Las **instrucciones docentes** refuerzan el tipo de pruebas esperadas (renderizado, condicional, props, state, eventos) bajo Jasmine. fileciteturn0file1L87-L130

---

## 2. Matriz de cobertura (componente × tipo de prueba)

| Componente / Vista | Archivo de test | Render | Props | State | Eventos | DOM / Routing | Reglas / Cálculos | Casos Vacíos / Borde |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **DetallePedidoPanel** | `DetallePedidoPanel.spec.jsx` | ✓ | — | — | — | ✓ (param :id; título/estado; botón deshabilitado) | ✓ (cruce item↔producto) | — |
| **EditarProductoPanel** | `EditarProductoPanel.spec.jsx` | ✓ | ✓ (precarga) | ✓ (inputs controlados) | ✓ (click Guardar) | ✓ (routing por :codigo) | — | — |
| **NuevoProductoPanel** | `NuevoProductoPanel.spec.jsx` | ✓ | ✓ (categoría) | ✓ (form) | ✓ (submit) | — | ✓ (persistencia localStorage; tipos numéricos) | — |
| **SolicitudesPanel** | `SolicitudesPanel.spec.jsx` | ✓ | — | — | — | — | ✓ (estados normalizados) | — |
| **PedidosPanel** | `PedidosPanel.spec.jsx` | ✓ | — | — | — | — | ✓ (mapeo de estados) | — |
| **ProductosPanel (smoke)** | `ProductosPanelSmoke.spec.jsx` | ✓ | — | — | — | — | — | — |
| **ProductosPocoStockPanel** | `ProductosPocoStockPanel.spec.jsx` | ✓ | — | — | — | — | ✓ (filtro críticos; orden ascendente) | ✓ (estado vacío) |
| **ReportesPanel** | `ReportesPanel.spec.jsx` | ✓ | — | ✓ (umbral) | ✓ (entrada de búsqueda) | — | ✓ (filtrado por término; críticos por umbral) | — |

**Leyenda**: ✓ = cubierto; — = no aplicaba o no cubierto por el test actual.

---

## 3. Cobertura por requisitos instruccionales

- **Pruebas de renderizado**: Todos los componentes listados hacen al menos una validación de render; se comprueba presencia de textos/filas y encabezados (p.ej., `ProductosPanelSmoke`, `PedidosPanel`). fileciteturn0file7L1-L23 fileciteturn0file6L1-L30  
- **Render condicional / estados**: Se valida botón deshabilitado en **DetallePedidoPanel** cuando el estado es *despachado*; en **ProductosPocoStockPanel** se verifica tabla vacía si no hay críticos. fileciteturn0file2L1-L25 fileciteturn0file8L45-L86  
- **Props y precarga**: **EditarProductoPanel** valida precarga por `:codigo`; **NuevoProductoPanel** usa categorías sembradas para selección válida. fileciteturn0file3L1-L23 fileciteturn0file4L1-L30  
- **Estado y eventos**: Se simulan cambios de inputs y clicks de guardar (**EditarProductoPanel**, **NuevoProductoPanel**); **ReportesPanel** filtra por término y ajusta *umbral*. fileciteturn0file3L24-L54 fileciteturn0file4L31-L90 fileciteturn0file9L1-L34  
- **Manipulación del DOM / Routing**: **DetallePedidoPanel** resuelve `:id`; **EditarProductoPanel** usa `:codigo`. fileciteturn0file2L1-L10 fileciteturn0file3L1-L10

---

## 4. Mocks, fixtures y aislamiento

- **localStorage**: Siembra consistente de `usuarios`, `sesion`, `productos`, `pedidos`, `solicitudes`. fileciteturn0file6L12-L33 fileciteturn0file8L21-L57  
- **Navegación/alertas**: `window.alert` y `window.location` son *spies* para evitar efectos colaterales. fileciteturn0file2L5-L18  
- **Clipboard**: Se provee mock cuando es requerido por paneles. fileciteturn0file4L9-L24 fileciteturn0file9L1-L16

---

## 5. Riesgos no cubiertos y backlog de pruebas

1. **Autorización / Guards**: Falta validar redirecciones cuando la sesión no es admin o está ausente.  
2. **Errores de validación**: Formularios con campos inválidos (precio negativo, códigos duplicados, etc.).  
3. **Persistencia fallida**: Manejo de excepciones al escribir/leer de `localStorage`.  
4. **Responsive/Bootstrap**: No se validan clases responsivas; se cubre en revisión visual.  
5. **Rutas inexistentes (404)**: No hay pruebas de *not found*.  
6. **Estados alternos**: Pedidos *cancelados*, solicitudes *en progreso*, etc.

> **Plan propuesto**: añadir specs adicionales por cada ítem, priorizando *Autorización* y *Validaciones* para cumplir con “proceso de testeo unitario” y robustecer la presentación. fileciteturn0file0L81-L118

---

## 6. Cómo reproducir y obtener métricas de cobertura

1. Ejecutar `npm test`/`karma start` con **karma-jasmine** y **karma-chrome**.  
2. Agregar **karma-coverage** (Istanbul) para generar reporte HTML/LCOV y evidenciar *% lines/branches/functions*.  
3. Incluir capturas del reporte en el *Anexo de Evidencias* del informe.

> La institución pide “Documento de cobertura de testing”; este archivo cumple el análisis de alcance y se recomienda adjuntar el reporte de `karma-coverage` como evidencia cuantitativa.

---

## 7. Conclusión

Las pruebas actuales cubren los flujos críticos de administración: alta/edición de productos, listados y reportes, además del detalle de pedidos y gestión de stock crítico. Se valida renderizado, eventos, estado y cálculos funcionales. Se identifican brechas y un plan concreto para ampliación, alineado con las **instrucciones** y la **rúbrica** de la EP2.
