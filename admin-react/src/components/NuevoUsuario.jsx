import React, { useState } from 'react';
import AdminLayout from './Layout/AdminLayout';

const NuevoUsuario = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    run: '',
    nombres: '',
    apellidos: '',
    correo: '',
    tipoUsuario: 'cliente',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Dominios permitidos del proyecto original
  const dominiosPermitidos = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

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

  // Función de validación de RUN del proyecto original
  const validarRun = (run) => {
    const limpio = (run || "").toUpperCase().replace(/\.|-/g, "");
    if (limpio.length < 7 || limpio.length > 9) return false;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    const dvCalc = resto === 11 ? "0" : (resto === 10 ? "K" : String(resto));
    return dv === dvCalc;
  };

  // Función de validación de correo del proyecto original
  const esCorreoPermitido = (correo) => {
    const m = (correo || "").toLowerCase().match(/^[\w.+-]+@([\w.-]+)$/);
    if (!m) return false;
    const dominio = m[1];
    return dominiosPermitidos.some(d => dominio.endsWith(d));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones exactas del JavaScript original
    if (!validarRun(formData.run)) {
      newErrors.errRunAdmin = "RUN inválido.";
    }
    
    if (!esCorreoPermitido(formData.correo) || formData.correo.length > 100) {
      newErrors.errCorreoAdmin = "Correo no permitido.";
    }
    
    if (!formData.nombres) {
      newErrors.errNombresAdmin = "Nombres requeridos.";
    }
    
    if (!formData.apellidos) {
      newErrors.errApellidosAdmin = "Apellidos requeridos.";
    }
    
    if (!formData.direccion || formData.direccion.length > 300) {
      newErrors.errDireccionAdmin = "Dirección requerida (máx 300 caracteres).";
    }

    // Verificar duplicados
    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");
    if (users.some(u => u.run.toUpperCase() === formData.run.toUpperCase())) {
      newErrors.errRunAdmin = "RUN ya existe.";
    }
    if (users.some(u => u.correo.toLowerCase() === formData.correo.toLowerCase())) {
      newErrors.errCorreoAdmin = "Correo ya existe.";
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

    // Crear nuevo usuario exactamente como en el original
    const nuevoUsuario = {
      run: formData.run,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo,
      fechaNacimiento: "",
      tipoUsuario: formData.tipoUsuario,
      region: "",
      comuna: "",
      direccion: formData.direccion,
      pass: "admin",
      descuentoDuoc: formData.correo.endsWith("@duoc.cl"),
      puntosLevelUp: 0,
      codigoReferido: ""
    };

    // Agregar a localStorage
    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");
    users.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(users));

    // Mostrar mensaje de éxito
    setMessage("Usuario guardado.");
    
    // Reset formulario
    setFormData({
      run: '',
      nombres: '',
      apellidos: '',
      correo: '',
      tipoUsuario: 'cliente',
      direccion: ''
    });
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
          // No hacer nada, mantener en la misma página
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

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="users" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Nuevo Usuario</h1>
          <form id="formUsuarioAdmin" className="formulario" onSubmit={handleSubmit} noValidate>
            <div className="fila">
              <label htmlFor="run">RUN</label>
              <input 
                id="run" 
                value={formData.run}
                onChange={handleChange}
                maxLength="9" 
                required 
              />
              <div className="error" id="errRunAdmin">{errors.errRunAdmin}</div>
            </div>

            <div className="fila">
              <label htmlFor="nombres">Nombres</label>
              <input 
                id="nombres" 
                value={formData.nombres}
                onChange={handleChange}
                maxLength="50" 
                required 
              />
              <div className="error" id="errNombresAdmin">{errors.errNombresAdmin}</div>
            </div>

            <div className="fila">
              <label htmlFor="apellidos">Apellidos</label>
              <input 
                id="apellidos" 
                value={formData.apellidos}
                onChange={handleChange}
                maxLength="100" 
                required 
              />
              <div className="error" id="errApellidosAdmin">{errors.errApellidosAdmin}</div>
            </div>

            <div className="fila">
              <label htmlFor="correo">Correo</label>
              <input 
                id="correo" 
                value={formData.correo}
                onChange={handleChange}
                type="email" 
                maxLength="100" 
                required 
              />
              <div className="error" id="errCorreoAdmin">{errors.errCorreoAdmin}</div>
            </div>

            <div className="fila">
              <label htmlFor="tipoUsuario">Tipo de Usuario</label>
              <select 
                id="tipoUsuario" 
                value={formData.tipoUsuario}
                onChange={handleChange}
                required
              >
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="fila">
              <label htmlFor="direccion">Dirección</label>
              <input 
                id="direccion" 
                value={formData.direccion}
                onChange={handleChange}
                maxLength="300" 
                required 
              />
              <div className="error" id="errDireccionAdmin">{errors.errDireccionAdmin}</div>
            </div>

            <button className="btn primario" type="submit">Guardar</button>
            <p id="msgUsuarioAdmin" className="exito">{message}</p>
          </form>
        </div>
      </AdminLayout>
    </div>
  );
};

export default NuevoUsuario;