import { useMemo } from 'react'
import { obtenerProductos, usuarioActual } from '../../services/storageService'
import { Link } from 'react-router-dom'

function AdminProductos(){
  const productos = useMemo(()=> obtenerProductos(), [])
  const u = usuarioActual()
  const esAdmin = u?.tipoUsuario === 'admin'

  return (
    <div className="panel">
      <h1>Productos</h1>
      {esAdmin && (
        <div style={{marginBottom:12}}>
          <Link to="/productos/nuevo" className="btn primario" id="btnNuevoProducto">Nuevo producto</Link>
        </div>
      )}
      <div className="tabla-responsive">
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th>{esAdmin && <th id="thAcciones">Acciones</th>}
            </tr>
          </thead>
          <tbody id="tablaProductos">
            {productos.map(p=> (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.precio?.toLocaleString('es-CL')}</td>
                <td>{p.stock ?? '—'}</td>
                {esAdmin && (
                  <td>
                    <Link className="btn secundario" to={`/productos/editar/${encodeURIComponent(p.codigo)}`}>Editar</Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductos
