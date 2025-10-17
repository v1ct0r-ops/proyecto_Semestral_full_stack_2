import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { obtenerProductos, guardarProductos, usuarioActual } from '../../services/storageService'

function AdminEditarProducto(){
  const { codigo } = useParams()
  const navigate = useNavigate()
  const u = usuarioActual()
  useEffect(()=>{
    if (!u || u.tipoUsuario !== 'admin') {
      alert('Acceso no permitido.')
      navigate('/productos')
    }
  }, [])

  const productos = useMemo(()=> obtenerProductos(), [])
  const prod = productos.find(p=>p.codigo===codigo)
  const [form, setForm] = useState(()=> prod || {})
  const [errs, setErrs] = useState({})

  if (!prod) return <div className="panel"><p>Producto no encontrado.</p></div>

  function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value})) }
  function validar(){
    const e={}
    if (!form.nombre || form.nombre.length>100) e.nombre = 'Requerido (máx 100).'
    const precio = parseFloat(form.precio); if (isNaN(precio)||precio<0) e.precio='Precio inválido (>=0)'
    const stock = parseInt(form.stock,10); if (isNaN(stock)||stock<0||!Number.isInteger(stock)) e.stock='Stock entero >=0'
    if (!form.categoria) e.categoria='Seleccioná una categoría.'
    return e
  }
  function onSubmit(e){
    e.preventDefault()
    const e2 = validar(); setErrs(e2); if (Object.keys(e2).length) return
    const arr = productos.map(p=> p.codigo===codigo ? {
      ...p,
      nombre: form.nombre.trim(),
      descripcion: (form.descripcion||'').trim(),
      detalles: (form.detalles||'').trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock,10),
      stockCritico: form.stockCritico? parseInt(form.stockCritico,10) : null,
      categoria: form.categoria,
      imagen: (form.imagen||'').trim()
    } : p)
    guardarProductos(arr)
    navigate('/productos')
  }

  return (
    <div className="panel">
      <h1>Editar producto</h1>
      <form onSubmit={onSubmit} id="formEditarProducto" className="form">
        <div className="campo"><label>Código</label><input value={form.codigo} disabled /></div>
        <div className="campo"><label>Nombre</label><input name="nombre" value={form.nombre||''} onChange={onChange} />{errs.nombre && <small className="error" id="errENombre">{errs.nombre}</small>}</div>
        <div className="campo"><label>Descripción</label><textarea name="descripcion" value={form.descripcion||''} onChange={onChange} /></div>
        <div className="campo"><label>Detalles</label><textarea name="detalles" value={form.detalles||''} onChange={onChange} /></div>
        <div className="fila">
          <div className="campo"><label>Precio</label><input name="precio" type="number" value={form.precio||''} onChange={onChange} />{errs.precio && <small className="error" id="errEPrecio">{errs.precio}</small>}</div>
          <div className="campo"><label>Stock</label><input name="stock" type="number" value={form.stock||''} onChange={onChange} />{errs.stock && <small className="error" id="errEStock">{errs.stock}</small>}</div>
          <div className="campo"><label>Stock crítico</label><input name="stockCritico" type="number" value={form.stockCritico||''} onChange={onChange} /></div>
        </div>
        <div className="fila">
          <div className="campo"><label>Categoría</label><input name="categoria" value={form.categoria||''} onChange={onChange} />{errs.categoria && <small className="error" id="errECategoria">{errs.categoria}</small>}</div>
          <div className="campo"><label>Imagen (URL)</label><input name="imagen" value={form.imagen||''} onChange={onChange} /></div>
        </div>
        <button className="btn primario" type="submit">Guardar</button>
      </form>
    </div>
  )
}

export default AdminEditarProducto
