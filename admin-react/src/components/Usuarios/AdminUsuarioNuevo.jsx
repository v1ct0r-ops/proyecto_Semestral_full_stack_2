import { useEffect, useState } from 'react'
import { obtenerUsuarios, guardarUsuarios } from '../../services/storageService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function AdminUsuarioNuevo(){
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  useEffect(()=>{
    if (!isAdmin) {
      alert('Acceso no permitido para tu rol.')
      navigate('/', { replace: true })
    }
  }, [isAdmin])
  const [form, setForm] = useState({ run:'', nombres:'', apellidos:'', correo:'', tipoUsuario:'', direccion:'' })
  const [errs, setErrs] = useState({})
  if (!isAdmin) return <div className="panel"><p>No autorizado.</p></div>

  function validar(){
    const e={}
    if (!form.run) e.run = 'RUN inválido.'
    const correoOk = /^[\w.+-]+@([\w.-]+)$/.test(form.correo) && form.correo.length<=100
    if (!correoOk) e.correo = 'Correo no permitido.'
    if (!form.nombres) e.nombres = 'Requerido.'
    if (!form.apellidos) e.apellidos = 'Requerido.'
    if (!form.direccion || form.direccion.length>300) e.direccion = 'Dirección inválida.'
    return e
  }
  function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value})) }
  function onSubmit(e){
    e.preventDefault()
    const e2 = validar(); setErrs(e2); if (Object.keys(e2).length) return
    const users = obtenerUsuarios()
    if (users.some(u=>u.run.toUpperCase()===form.run.toUpperCase())){ setErrs({run:'RUN ya existe.'}); return }
    if (users.some(u=>u.correo.toLowerCase()===form.correo.toLowerCase())){ setErrs({correo:'Correo ya existe.'}); return }
    users.push({
      run: form.run.trim(),
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      fechaNacimiento: '',
      tipoUsuario: form.tipoUsuario,
      region: '', comuna: '',
      direccion: form.direccion.trim(),
      pass: 'admin', descuentoDuoc: form.correo.endsWith('@duoc.cl'),
      puntosLevelUp:0, codigoReferido:''
    })
    guardarUsuarios(users)
    navigate('/usuarios')
  }

  return (
    <div className="panel">
      <h1>Nuevo usuario</h1>
      <form onSubmit={onSubmit} id="formUsuarioAdmin" className="form">
        <div className="campo"><label>RUN</label><input name="run" value={form.run} onChange={onChange} />{errs.run && <small className="error" id="errRunAdmin">{errs.run}</small>}</div>
        <div className="campo"><label>Nombres</label><input name="nombres" value={form.nombres} onChange={onChange} />{errs.nombres && <small className="error">{errs.nombres}</small>}</div>
        <div className="campo"><label>Apellidos</label><input name="apellidos" value={form.apellidos} onChange={onChange} />{errs.apellidos && <small className="error">{errs.apellidos}</small>}</div>
        <div className="campo"><label>Correo</label><input name="correo" value={form.correo} onChange={onChange} />{errs.correo && <small className="error" id="errCorreoAdmin">{errs.correo}</small>}</div>
        <div className="campo"><label>Tipo</label>
          <select name="tipoUsuario" value={form.tipoUsuario} onChange={onChange}>
            <option value="">Seleccionar...</option>
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
        <div className="campo"><label>Dirección</label><input name="direccion" value={form.direccion} onChange={onChange} />{errs.direccion && <small className="error">{errs.direccion}</small>}</div>
        <button className="btn primario" type="submit">Guardar</button>
      </form>
    </div>
  )
}

export default AdminUsuarioNuevo
