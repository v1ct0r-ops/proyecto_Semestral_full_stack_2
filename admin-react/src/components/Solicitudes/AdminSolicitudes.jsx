import { useEffect, useMemo, useState } from 'react'

function AdminSolicitudes(){
  const [estado, setEstado] = useState('')
  const [solicitudes, setSolicitudes] = useState(()=> JSON.parse(localStorage.getItem('solicitudes')||'[]'))

  useEffect(()=>{
    // No hay lógica de roles especiales aquí, usa ProtectedRoute global
  }, [])

  const filtradas = useMemo(()=>
    (estado? solicitudes.filter(s=>s.estado===estado) : solicitudes)
  ,[estado, solicitudes])

  function toggleEstado(idx){
    const nuevo = [...solicitudes]
    nuevo[idx].estado = nuevo[idx].estado === 'pendiente' ? 'completado' : 'pendiente'
    setSolicitudes(nuevo)
    localStorage.setItem('solicitudes', JSON.stringify(nuevo))
  }

  return (
    <div className="panel">
      <h1>Solicitudes</h1>
      <div className="campo" style={{maxWidth:300}}>
        <label>Estado</label>
        <select id="filtroSoliciutudes" value={estado} onChange={e=>setEstado(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <div id="listaSolicitud">
        {filtradas.map((sol, idx)=> (
          <article key={idx} className="tarjeta">
            <div className="contenido">
              <h4>Solicitud {idx+1}</h4>
              <p className="info">{sol.fecha || ''} {sol.hora || ''}</p>
              <p><strong>Nombre:</strong> {sol.nombre || '-'}</p>
              <p><strong>Correo:</strong> {sol.correo || '-'}</p>
              <p><strong>Descripción:</strong> {sol.descripcion || '-'}</p>
              <div className="acciones" style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap'}}>
                <button className='btn secundario btn-estado' onClick={()=>toggleEstado(idx)}>
                  {sol.estado === 'pendiente' ? 'pendiente' : 'completado'}
                </button>
                <a className='btn secundario' href={`/solicitudes/${idx}`}>Ver detalle</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminSolicitudes
