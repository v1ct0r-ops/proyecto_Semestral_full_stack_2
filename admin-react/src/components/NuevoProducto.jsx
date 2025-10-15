import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const NuevoProducto = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    detalles: '',
    precio: '',
    stock: '',
    stockCritico: '',
    categoria: '',
    imagen: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // Añadir flag para prevenir navegación durante guardado

  useEffect(() => {
    // Categorías base del proyecto original
    const categoriasBase = [
      "Juegos de Mesa",
      "Accesorios", 
      "Consolas",
      "Computadores Gamers",
      "Sillas Gamers",
      "Mouse",
      "Mousepad", 
      "Poleras Personalizadas",
      "Polerones Gamers Personalizados",
      "Servicio técnico"
    ];
    setCategorias(categoriasBase);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones exactas del JavaScript original
    if (formData.codigo.length < 3) {
      newErrors.errCodigoProducto = "Mínimo 3 caracteres.";
    }
    
    if (!formData.nombre || formData.nombre.length > 100) {
      newErrors.errNombreProducto = "Requerido (máx 100).";
    }
    
    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio < 0) {
      newErrors.errPrecioProducto = "Precio inválido (>=0)";
    }
    
    const stock = parseInt(formData.stock, 10);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      newErrors.errStockProducto = "Stock entero >=0";
    }
    
    if (!formData.categoria) {
      newErrors.errCategoriaProducto = "Seleccioná una categoría.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setIsSaving(true); // Bloquear navegación durante guardado
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setIsSaving(false);
      return;
    }

    // Verificar si el código ya existe (simulado)
    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    if (productos.some(p => p.codigo.toUpperCase() === formData.codigo.toUpperCase())) {
      setErrors({ errCodigoProducto: "El código ya existe." });
      setIsSaving(false);
      return;
    }

    // Crear nuevo producto
    const nuevoProducto = {
      codigo: formData.codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      detalles: formData.detalles || "",
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      stockCritico: formData.stockCritico ? parseInt(formData.stockCritico, 10) : null,
      categoria: formData.categoria,
      imagen: formData.imagen
    };

    // Agregar a localStorage
    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos));

    // Mostrar mensaje de éxito
    setMessage("Producto guardado.");
    
    // Reset formulario
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      detalles: '',
      precio: '',
      stock: '',
      stockCritico: '',
      categoria: '',
      imagen: ''
    });
    
    // Desbloquear navegación después de un breve delay
    setTimeout(() => {
      setIsSaving(false);
    }, 100);
  };

  const handleMenuChange = (menuId) => {
    // Prevenir navegación si estamos guardando
    if (isSaving) {
      return;
    }
    
    if (onNavigate) {
      switch(menuId) {
        case 'dashboard':
          onNavigate('dashboard');
          break;
        case 'products':
          onNavigate('products');
          break;
        case 'newProduct':
          // No hacer nada, mantener en la misma página
          break;
        case 'editProduct':
          onNavigate('editProduct');
          break;
        case 'users':
          onNavigate('users');
          break;
        case 'newUser':
          onNavigate('newUser');
          break;
        case 'orders':
          onNavigate('orders');
          break;
        case 'requests':
          onNavigate('requests');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="products" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Nuevo Producto</h1>
          <form id="formProducto" className="formulario" onSubmit={handleSubmit} noValidate>
            <div className="fila">
              <label htmlFor="codigo">Código</label>
              <input 
                id="codigo" 
                value={formData.codigo}
                onChange={handleChange}
                minLength="3" 
                required 
              />
              <div className="error" id="errCodigoProducto">{errors.errCodigoProducto}</div>
            </div>

            <div className="fila">
              <label htmlFor="nombre">Nombre</label>
              <input 
                id="nombre" 
                value={formData.nombre}
                onChange={handleChange}
                maxLength="100" 
                required 
              />
              <div className="error" id="errNombreProducto">{errors.errNombreProducto}</div>
            </div>

            <div className="fila">
              <label htmlFor="descripcion">Descripción</label>
              <textarea 
                id="descripcion" 
                value={formData.descripcion}
                onChange={handleChange}
                maxLength="500" 
                rows="3"
              />
            </div>

            <div className="fila">
              <label htmlFor="detalles">Detalles (opcional)</label>
              <textarea 
                id="detalles" 
                value={formData.detalles}
                onChange={handleChange}
                rows="4" 
                placeholder="Origen, fabricante, distribuidor, certificaciones…"
              />
              <small className="pista">Se muestra en "Ver más" del detalle.</small>
              <div className="error" id="errDetallesProducto">{errors.errDetallesProducto}</div>
            </div>

            <div className="fila dos">
              <div>
                <label htmlFor="precio">Precio</label>
                <input 
                  id="precio" 
                  value={formData.precio}
                  onChange={handleChange}
                  type="number" 
                  min="0" 
                  step="0.01" 
                  required 
                />
                <div className="error" id="errPrecioProducto">{errors.errPrecioProducto}</div>
              </div>
              <div>
                <label htmlFor="stock">Stock</label>
                <input 
                  id="stock" 
                  value={formData.stock}
                  onChange={handleChange}
                  type="number" 
                  min="0" 
                  step="1" 
                  required 
                />
                <div className="error" id="errStockProducto">{errors.errStockProducto}</div>
              </div>
            </div>

            <div className="fila">
              <label htmlFor="stockCritico">Stock Crítico (opcional)</label>
              <input 
                id="stockCritico" 
                value={formData.stockCritico}
                onChange={handleChange}
                type="number" 
                min="0" 
                step="1" 
              />
            </div>

            <div className="fila">
              <label htmlFor="categoria">Categoría</label>
              <select 
                id="categoria" 
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="error" id="errCategoriaProducto">{errors.errCategoriaProducto}</div>
            </div>

            <div className="fila">
              <label htmlFor="imagen">Imagen (URL opcional)</label>
              <input 
                id="imagen" 
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://..." 
              />
            </div>

            <button className="btn primario" type="submit">Guardar</button>
            <p id="msgProducto" className="exito">{message}</p>
          </form>
        </div>
      </AdminLayout>
    </div>
  );
};

export default NuevoProducto;