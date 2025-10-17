import { useEffect, useMemo } from 'react'
import { obtenerUsuarios } from '../../services/storageService'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function AdminUsuarios(){
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  useEffect(()=>{
    if (!isAdmin) {
      alert('Acceso no permitido para tu rol.')
      navigate('/', { replace: true })
    }
  }, [isAdmin])
  const usuarios = useMemo(()=> obtenerUsuarios(), [])
  if (!isAdmin) return <div className="panel"><p>No autorizado.</p></div>

  return (
    <div className="panel">
      <h1>Usuarios</h1>
      <div style={{marginBottom:12}}>
        <Link to="/usuarios/nuevo" className="btn primario">Nuevo usuario</Link>
      </div>
      <div className="tabla-responsive">
        <table className="tabla">
          <thead>
            <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th></tr>
          </thead>
          <tbody id="tablaUsuarios">
            {usuarios.map(u => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombres} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.tipoUsuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsuarios
