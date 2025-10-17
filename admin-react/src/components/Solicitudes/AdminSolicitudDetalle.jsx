import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

function renderDetalleSolicitud(solicitud, idx){
  if (!solicitud) return <p>No se encontró la solicitud.</p>
  const fecha = solicitud.fecha && solicitud.hora ? `${solicitud.fecha} ${solicitud.hora}` : (solicitud.fecha || '')
  return (
    <article className="tarjeta">
      <div className="contenido">
        <h4>Solicitud #{idx+1}</h4>
        <p className="info">{fecha}</p>
        <p><strong>Nombre:</strong> {solicitud.nombre || '-'}</p>
        <p><strong>Correo:</strong> {solicitud.correo || '-'}</p>
        <p><strong>Descripción:</strong> {solicitud.descripcion || '-'}</p>
        <p><strong>Estado:</strong> {solicitud.estado || '-'}</p>
      </div>
    </article>
  )
}

function AdminSolicitudDetalle(){
  const { id } = useParams()
  const idx = parseInt(id,10)
  const solicitudes = useMemo(()=> JSON.parse(localStorage.getItem('solicitudes')||'[]'), [])
  const solicitud = solicitudes[idx]

  return (
    <div className="panel">
      <h1>Detalle de Solicitud</h1>
      <div id="detalleSolicitud">{renderDetalleSolicitud(solicitud, idx)}</div>
      <button className='btn secundario' onClick={()=> history.back()}>Volver</button>
    </div>
  )
}

export default AdminSolicitudDetalle
