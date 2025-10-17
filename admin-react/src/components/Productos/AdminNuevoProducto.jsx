import { useEffect, useState } from 'react'
import { obtenerProductos, guardarProductos } from '../../services/storageService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function AdminNuevoProducto(){
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  useEffect(()=>{
    if (!isAdmin) {
      alert('Acceso no permitido para tu rol.')
      navigate('/', { replace: true })
    }
  }, [isAdmin])
  const [form, setForm] = useState({ codigo:'', nombre:'', descripcion:'', detalles:'', precio:'', stock:'', stockCritico:'', categoria:'', imagen:'' })
  const [errs, setErrs] = useState({})

  function onChange(e){
    setForm(f => ({...f, [e.target.name]: e.target.value}))
  }
  function validar(){
    const e = {}
    if (!form.codigo || form.codigo.length<3) e.codigo = 'Mínimo 3 caracteres.'
    if (!form.nombre || form.nombre.length>100) e.nombre = 'Requerido (máx 100).'
    const precio = parseFloat(form.precio); if (isNaN(precio)||precio<0) e.precio='Precio inválido (>=0)'
    const stock = parseInt(form.stock,10); if (isNaN(stock)||stock<0||!Number.isInteger(stock)) e.stock='Stock entero >=0'
    if (!form.categoria) e.categoria='Seleccioná una categoría.'
    return e
  }
  function onSubmit(e){
    e.preventDefault()
    const e2 = validar(); setErrs(e2); if (Object.keys(e2).length) return
    const prods = obtenerProductos()
    if (prods.some(p=>p.codigo.toUpperCase()===form.codigo.toUpperCase())){ setErrs({codigo:'El código ya existe.'}); return }
    prods.push({
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      detalles: (form.detalles||'').trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock,10),
      stockCritico: form.stockCritico? parseInt(form.stockCritico,10) : null,
      categoria: form.categoria,
      imagen: (form.imagen||'').trim()
    })
    guardarProductos(prods)
    navigate('/productos')
  }

  return (
    <div className="panel">
      <h1>Nuevo producto</h1>
      <form onSubmit={onSubmit} id="formProducto" className="form">
        <div className="campo">
          <label>Código</label>
          <input name="codigo" value={form.codigo} onChange={onChange} />
          {errs.codigo && <small className="error" id="errCodigoProducto">{errs.codigo}</small>}
        </div>
        <div className="campo">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={onChange} />
          {errs.nombre && <small className="error" id="errNombreProducto">{errs.nombre}</small>}
        </div>
        <div className="campo">
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={onChange} />
        </div>
        <div className="campo">
          <label>Detalles</label>
          <textarea name="detalles" value={form.detalles} onChange={onChange} />
        </div>
        <div className="fila">
          <div className="campo">
            <label>Precio</label>
            <input name="precio" type="number" value={form.precio} onChange={onChange} />
            {errs.precio && <small className="error" id="errPrecioProducto">{errs.precio}</small>}
          </div>
          <div className="campo">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={onChange} />
            {errs.stock && <small className="error" id="errStockProducto">{errs.stock}</small>}
          </div>
          <div className="campo">
            <label>Stock crítico</label>
            <input name="stockCritico" type="number" value={form.stockCritico} onChange={onChange} />
          </div>
        </div>
        <div className="fila">
          <div className="campo">
            <label>Categoría</label>
            <input name="categoria" value={form.categoria} onChange={onChange} />
            {errs.categoria && <small className="error" id="errCategoriaProducto">{errs.categoria}</small>}
          </div>
          <div className="campo">
            <label>Imagen (URL)</label>
            <input name="imagen" value={form.imagen} onChange={onChange} />
          </div>
        </div>
        <button className="btn primario" type="submit">Guardar</button>
      </form>
    </div>
  )
}

export default AdminNuevoProducto
