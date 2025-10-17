import { useEffect, useMemo, useState } from 'react'
import { obtenerPedidos } from '../../services/storageService'
import { Link } from 'react-router-dom'

function AdminPedidos(){
  const [estado, setEstado] = useState('')
  const pedidos = useMemo(()=> obtenerPedidos(), [])
  const filtrados = pedidos
    .slice()
    .sort((a,b)=> new Date(b.fecha) - new Date(a.fecha))
    .filter(p => !estado || p.estado === estado)

  return (
    <div className="panel">
      <h1>Pedidos</h1>
      <div className="campo" style={{maxWidth:300}}>
        <label>Estado</label>
        <select id="filtroPedidos" value={estado} onChange={e=>setEstado(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="despachado">Despachado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div id="listaPedidos">
        {filtrados.length===0 && <p className="info">No hay pedidos para este filtro.</p>}
        {filtrados.map(p=> (
          <article key={p.id} className="tarjeta">
            <div className="contenido">
              <h4>{p.id}</h4>
              <p className="info">{new Date(p.fecha).toLocaleString('es-CL')} · {p.comprador.nombres} {p.comprador.apellidos} ({p.comprador.correo})</p>
              <p><small>Envío: {p.envio.direccion}, {p.envio.comuna}, {p.envio.region}</small></p>
              <p><strong>Total:</strong> {p.total?.toLocaleString('es-CL')}</p>
              <div>
                <Link className={`btn ${p.estado==='pendiente'?'peligro':p.estado==='despachado'?'exito':'secundario'}`} to={`/pedidos/${encodeURIComponent(p.id)}`}>
                  {p.estado.charAt(0).toUpperCase()+p.estado.slice(1)}
                </Link>
                <Link className="btn secundario" to={`/pedidos/${encodeURIComponent(p.id)}`}>Ver detalle</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminPedidos
