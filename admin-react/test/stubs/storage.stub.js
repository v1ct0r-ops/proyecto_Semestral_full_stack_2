// test/stubs/storage.stub.js
// Base de datos simulada en memoria, solo para pruebas
const _db = {
  // Lista de usuarios con un admin por defecto
  usuarios: [
    { run: "11.111.111-1", correo: "admin@site.com", nombres: "Admin", apellidos: "Uno", tipoUsuario: "admin" },
  ],
  // Lista de solicitudes simuladas
  solicitudes: [
    {
      id: "SOL-4",
      titulo: "SOL-4",
      nombre: "Juan",
      correo: "juan@site.com",
      descripcion: "Necesito soporte de mi pedido.",
      estado: "pendiente",
      fecha: new Date().toISOString(),
    },
    {
      id: "SOL-5",
      titulo: "SOL-5",
      nombre: "Ana",
      correo: "ana@site.com",
      descripcion: "Consulta por garantía.",
      estado: "completado",
      fecha: new Date().toISOString(),
    },
  ],
};

// Función para obtener un dato de la "base de datos"
// Si no existe la clave, devuelve el valor por defecto (def)
export function obtener(clave, def) {
  const v = _db[clave];
  // Retorno una copia para no modificar el original
  return v === undefined ? def : JSON.parse(JSON.stringify(v));
}

// Función para guardar un valor en la "base de datos"
// Se hace una copia para que quede aislado de referencias externas
export function guardar(clave, valor) {
  _db[clave] = JSON.parse(JSON.stringify(valor));
}

// Función que devuelve el usuario actual (simula que hay sesión activa)
// En este stub siempre será el primer usuario (admin)
export function usuarioActual() {
  return _db.usuarios[0];
}
