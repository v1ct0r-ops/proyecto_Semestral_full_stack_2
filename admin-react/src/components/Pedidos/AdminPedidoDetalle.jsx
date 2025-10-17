import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { obtenerPedidos, guardarPedidos, obtenerProductos } from '../../services/storageService'

function AdminPedidoDetalle(){
  const { id } = useParams()
  const navigate = useNavigate()
  const pedidos = useMemo(()=> obtenerPedidos(), [])
  const [arr, setArr] = useState(pedidos)
  const ped = arr.find(p=>p.id===id)
  const prods = useMemo(()=> obtenerProductos(), [])
  if (!ped) return <div className="panel"><p className="info">Pedido no encontrado.</p></div>

  function actualizarEstado(nuevo){
    const copia = arr.map(p => p.id===id ? {...p, estado: nuevo} : p)
    setArr(copia)
    guardarPedidos(copia)
    alert(nuevo==='despachado' ? 'Pedido marcado como despachado.' : 'Pedido actualizado.')
  }

  const filas = ped.items.map(it => {
    const p = prods.find(x=>x.codigo===it.codigo)
    const nombre = p? p.nombre : it.codigo
    return (
      <div key={it.codigo} className="item-carrito">
        <div><strong>{nombre}</strong><br/><small>{it.codigo}</small></div>
        <div>{it.precio?.toLocaleString('es-CL')}</div>
        <div>x{it.cantidad}</div>
      </div>
    )
  })

  const puedeDespachar = ped.estado === 'pendiente'

  return (
    <div className="panel">
      <h1 id="tituloPedido">Pedido {ped.id} — {ped.estado.toUpperCase()}</h1>
      <article className="tarjeta">
        <div className="contenido" id="detallePedido">
          <p><strong>Fecha:</strong> {new Date(ped.fecha).toLocaleString('es-CL')}</p>
          <p><strong>Cliente:</strong> {ped.comprador.nombres} {ped.comprador.apellidos} — {ped.comprador.correo}</p>
          <p><strong>Envío:</strong> {ped.envio.direccion}, {ped.envio.comuna}, {ped.envio.region}</p>
          <p><strong>Total:</strong> {ped.total?.toLocaleString('es-CL')}</p>
          <h4>Ítems</h4>
          {filas}
        </div>
      </article>
      <button id="btnMarcarDespachado" className={`btn ${puedeDespachar? 'exito':'secundario'}`} disabled={!puedeDespachar} onClick={()=> actualizarEstado('despachado')}>
        {puedeDespachar ? 'Marcar como despachado' : ped.estado==='despachado' ? 'Pedido despachado' : 'Pedido cancelado'}
      </button>
    </div>
  )
}

export default AdminPedidoDetalle
