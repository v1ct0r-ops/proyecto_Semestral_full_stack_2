import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const EditarProducto = ({ onNavigate, productCode }) => {
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
  const [loading, setLoading] = useState(true);

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

    // Cargar producto a editar
    if (productCode) {
      cargarProducto(productCode);
    }
  }, [productCode]);

  const cargarProducto = (codigo) => {
    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    const producto = productos.find(p => p.codigo === codigo);
    
    if (!producto) {
      alert("Producto no encontrado.");
      onNavigate('products');
      return;
    }

    setFormData({
      codigo: producto.codigo,
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      detalles: producto.detalles || '',
      precio: producto.precio ? producto.precio.toString() : '',
      stock: producto.stock ? producto.stock.toString() : '',
      stockCritico: producto.stockCritico ? producto.stockCritico.toString() : '',
      categoria: producto.categoria || '',
      imagen: producto.imagen || ''
    });
    
    setLoading(false);
  };

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
    
    // Validaciones exactas del JavaScript original para edición
    if (!formData.nombre || formData.nombre.length > 100) {
      newErrors.errENombre = "Requerido (máx 100).";
    }
    
    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio < 0) {
      newErrors.errEPrecio = "Precio inválido (>=0)";
    }
    
    const stock = parseInt(formData.stock, 10);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      newErrors.errEStock = "Stock entero >=0";
    }
    
    if (!formData.categoria) {
      newErrors.errECategoria = "Seleccioná una categoría.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Cargar productos y encontrar el producto a editar
    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    const productoIndex = productos.findIndex(p => p.codigo === formData.codigo);
    
    if (productoIndex === -1) {
      alert("Producto no encontrado.");
      return;
    }

    // Aplicar cambios al producto
    productos[productoIndex] = {
      ...productos[productoIndex],
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      detalles: formData.detalles,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock, 10),
      stockCritico: formData.stockCritico ? parseInt(formData.stockCritico, 10) : null,
      categoria: formData.categoria,
      imagen: formData.imagen
    };

    // Guardar cambios
    localStorage.setItem("productos", JSON.stringify(productos));

    // Mostrar mensaje de éxito
    setMessage("Cambios guardados.");
    
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      setMessage("");
    }, 1200);
  };

  const handleMenuChange = (menuId) => {
    if (onNavigate) {
      switch(menuId) {
        case 'dashboard':
          onNavigate('dashboard');
          break;
        case 'products':
          onNavigate('products');
          break;
        case 'newProduct':
          onNavigate('newProduct');
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
        case 'boletas':
          onNavigate('boletas');
          break;
        default:
          break;
      }
    }
  };

  const handleVolver = () => {
    onNavigate('products');
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
        <AdminLayout activeMenu="products" onMenuChange={handleMenuChange}>
          <div className="panel">
            <h1>Cargando...</h1>
          </div>
        </AdminLayout>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="products" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Editar Producto</h1>
          <form id="formEditarProducto" className="formulario" onSubmit={handleSubmit} noValidate>
            <div className="fila">
              <label htmlFor="codigo">Código</label>
              <input 
                id="codigo" 
                value={formData.codigo}
                readOnly
              />
              <small className="pista">El código no puede modificarse.</small>
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
              <div className="error" id="errENombre">{errors.errENombre}</div>
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
                <div className="error" id="errEPrecio">{errors.errEPrecio}</div>
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
                <div className="error" id="errEStock">{errors.errEStock}</div>
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
              <div className="error" id="errECategoria">{errors.errECategoria}</div>
            </div>

            <div className="fila">
              <label htmlFor="imagen">Imagen (URL)</label>
              <input 
                id="imagen" 
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://..." 
              />
            </div>

            <div className="acciones" style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              <button className="btn primario" type="submit">Guardar cambios</button>
              <button 
                className="btn secundario" 
                type="button"
                onClick={handleVolver}
              >
                Volver
              </button>
            </div>
            <p id="msgEditarProducto" className="exito">{message}</p>
          </form>
        </div>
      </AdminLayout>
    </div>
  );
};

export default EditarProducto;