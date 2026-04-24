// ══════════════════════════════════
// SEDES
// ══════════════════════════════════
const SEDES = [
  { id: 1, nombre: "Sede Central",   ciudad: "Ciudad A", color: "#3b82f6" },
  { id: 2, nombre: "Sede Norte",     ciudad: "Ciudad B", color: "#10b981" },
  { id: 3, nombre: "Sede Sur",       ciudad: "Ciudad C", color: "#f97316" },
  { id: 4, nombre: "Sede Este",      ciudad: "Ciudad D", color: "#8b5cf6" },
];

// ══════════════════════════════════
// USUARIOS
// ══════════════════════════════════
const USUARIOS = [
  // ADMIN — sin sede (ve todo)
  { id: 1, usuario: "admin",    password: "admin123", rol: "admin",         nombre: "Carlos Méndez",  cargo: "Administrador",          sedeId: null },

  // RECEPCIONISTAS — uno por sede
  { id: 2, usuario: "recep1",   password: "rec123",   rol: "recepcionista", nombre: "María Torres",   cargo: "Encargado de Dpto.",      sedeId: 1 },
  { id: 3, usuario: "recep2",   password: "rec456",   rol: "recepcionista", nombre: "Laura Ramírez",  cargo: "Encargado de Dpto.",      sedeId: 2 },
  { id: 4, usuario: "recep3",   password: "rec789",   rol: "recepcionista", nombre: "Jorge Pérez",    cargo: "Encargado de Dpto.",      sedeId: 3 },
  { id: 5, usuario: "recep4",   password: "rec000",   rol: "recepcionista", nombre: "Sofía Mendoza",  cargo: "Encargado de Dpto.",      sedeId: 4 },

  // TÉCNICOS — exclusivos por sede
  { id: 6, usuario: "tecnico1", password: "tec123",   rol: "tecnico",       nombre: "María González", cargo: "Técnico Senior",          sedeId: 1 },
  { id: 7, usuario: "tecnico2", password: "tec456",   rol: "tecnico",       nombre: "Miguel Chen",    cargo: "Técnico",                 sedeId: 1 },
  { id: 8, usuario: "tecnico3", password: "tec789",   rol: "tecnico",       nombre: "Ana López",      cargo: "Técnico",                 sedeId: 2 },
  { id: 9, usuario: "tecnico4", password: "tec000",   rol: "tecnico",       nombre: "Pedro Rivas",    cargo: "Técnico Senior",          sedeId: 3 },
  { id: 10,usuario: "tecnico5", password: "tec111",   rol: "tecnico",       nombre: "Carmen Díaz",    cargo: "Técnico",                 sedeId: 4 },
];

// ══════════════════════════════════
// SOLUCIONES
// ══════════════════════════════════
const SOLUCIONES = [
  { id: 1, titulo: "Problemas de conectividad de red",   categoria: "Redes",     descripcion: "Verificar cables, reiniciar switch, verificar configuración IP" },
  { id: 2, titulo: "Servidor de correo no responde",     categoria: "Email",     descripcion: "Reiniciar servicio de correo, verificar puertos 25, 587 y 993" },
  { id: 3, titulo: "Instalación de software",            categoria: "Software",  descripcion: "Verificar licencias disponibles, usar herramienta de despliegue automático" },
  { id: 4, titulo: "Impresora con papel atascado",       categoria: "Hardware",  descripcion: "Abrir bandeja, retirar papel cuidadosamente, limpiar rodillos" },
  { id: 5, titulo: "Problemas de VPN",                   categoria: "Seguridad", descripcion: "Verificar credenciales, reinstalar cliente VPN, revisar firewall" },
  { id: 6, titulo: "Pantalla azul (BSOD)",               categoria: "Hardware",  descripcion: "Anotar código de error, reiniciar en modo seguro, verificar drivers" },
  { id: 7, titulo: "Cuenta bloqueada",                   categoria: "Cuentas",   descripcion: "Verificar intentos fallidos, desbloquear desde directorio activo" },
  { id: 8, titulo: "Disco duro lleno",                   categoria: "Software",  descripcion: "Limpiar archivos temporales, mover datos a servidor, ampliar cuota" },
];

// ══════════════════════════════════
// TICKETS
// ══════════════════════════════════
let ticketContador = 2406;

function generarId() {
  ticketContador++;
  return "T-" + ticketContador;
}

function ahora() {
  return new Date().toISOString();
}

function formatearFecha(iso) {
  let d = new Date(iso);
  return d.toLocaleDateString("es") + " " + d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function tiempoTranscurrido(iso) {
  let diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 60)   return "Hace " + Math.round(diff) + " minutos";
  if (diff < 1440) return "Hace " + Math.round(diff / 60) + " horas";
  return "Hace " + Math.round(diff / 1440) + " días";
}

let TICKETS = [
  {
    id: "T-2401", estado: "CREADO", prioridad: "inmediata",
    titulo: "Problemas de conectividad de red en Edificio A - Piso 3",
    descripcion: "Los usuarios del tercer piso del Edificio A reportan intermitencia en la conexión a internet.",
    departamento: "Operaciones de Red", equipo: "Red / Switch",
    solicitante: "María Torres", tecnico: null,
    sedeId: 1, // ← AGREGAR
    creadoEn: new Date(Date.now() - 15 * 60000).toISOString(),
    historial: [
      { accion: "Ticket creado", usuario: "María Torres", detalle: "Ticket creado desde el portal", fecha: new Date(Date.now() - 15 * 60000).toISOString() }
    ]
  },
  {
    id: "T-2402", estado: "EN_PROCESO", prioridad: "alta",
    titulo: "Servidor de correo no responde para equipo de Marketing",
    descripcion: "El servidor de correo no está respondiendo para los usuarios del departamento de Marketing.",
    departamento: "Servicios de Email", equipo: "Servidor",
    solicitante: "Laura Ramírez", tecnico: "Miguel Chen",
    sedeId: 1,
    creadoEn: new Date(Date.now() - 60 * 60000).toISOString(),
    historial: [
      { accion: "Ticket creado",       usuario: "Laura Ramírez",  detalle: "Ticket creado desde el portal", fecha: new Date(Date.now() - 60 * 60000).toISOString() },
      { accion: "Ticket asignado",     usuario: "Carlos Méndez",  detalle: "Asignado a Miguel Chen",        fecha: new Date(Date.now() - 50 * 60000).toISOString() },
      { accion: "Estado → EN PROCESO", usuario: "Miguel Chen",    detalle: "Iniciando diagnóstico",         fecha: new Date(Date.now() - 45 * 60000).toISOString() },
    ]
  },
  {
    id: "T-2403", estado: "ASIGNADO", prioridad: "media",
    titulo: "Solicitud de instalación de software - Adobe Creative Suite",
    descripcion: "El departamento de diseño solicita la instalación de Adobe Creative Suite en 5 equipos.",
    departamento: "Despliegue de Software", equipo: "PC / Laptop",
    solicitante: "María Torres", tecnico: "Ana López",
    sedeId: 2,
    creadoEn: new Date(Date.now() - 120 * 60000).toISOString(),
    historial: [
      { accion: "Ticket creado",   usuario: "María Torres",  detalle: "Ticket creado desde el portal", fecha: new Date(Date.now() - 120 * 60000).toISOString() },
      { accion: "Ticket asignado", usuario: "Carlos Méndez", detalle: "Asignado a Ana López",          fecha: new Date(Date.now() - 100 * 60000).toISOString() },
    ]
  },
  {
    id: "T-2404", estado: "EN_PROCESO", prioridad: "baja",
    titulo: "Impresora con fallo en Sala de Conferencias B",
    descripcion: "La impresora de la Sala de Conferencias B no imprime correctamente.",
    departamento: "Soporte de Hardware", equipo: "Impresora",
    solicitante: "Laura Ramírez", tecnico: "Ana López",
    sedeId: 2,
    creadoEn: new Date(Date.now() - 180 * 60000).toISOString(),
    historial: [
      { accion: "Ticket creado",       usuario: "Laura Ramírez",  detalle: "Ticket creado desde el portal", fecha: new Date(Date.now() - 180 * 60000).toISOString() },
      { accion: "Ticket asignado",     usuario: "Carlos Méndez",  detalle: "Asignado a Ana López",          fecha: new Date(Date.now() - 160 * 60000).toISOString() },
      { accion: "Estado → EN PROCESO", usuario: "Ana López",      detalle: "Revisando impresora",           fecha: new Date(Date.now() - 150 * 60000).toISOString() },
    ]
  },
  {
    id: "T-2405", estado: "CREADO", prioridad: "alta",
    titulo: "Acceso VPN no funciona para empleado remoto",
    descripcion: "Un empleado que trabaja remotamente no puede conectarse a la VPN corporativa.",
    departamento: "Seguridad de Red", equipo: "PC / Laptop",
    solicitante: "Jorge Pérez", tecnico: null,
    sedeId: 3,
    creadoEn: new Date(Date.now() - 45 * 60000).toISOString(),
    historial: [
      { accion: "Ticket creado", usuario: "Jorge Pérez", detalle: "Ticket creado desde el portal", fecha: new Date(Date.now() - 45 * 60000).toISOString() }
    ]
  },
  {
    id: "T-2406", estado: "CERRADO", prioridad: "media",
    titulo: "Restablecimiento de contraseña para cuenta ejecutiva",
    descripcion: "El gerente general no puede acceder a su cuenta de correo corporativo.",
    departamento: "Gestión de Cuentas", equipo: "PC / Laptop",
    solicitante: "Sofía Mendoza", tecnico: "Carmen Díaz",
    sedeId: 4,
    creadoEn: new Date(Date.now() - 300 * 60000).toISOString(),
    informe: "Se restableció la contraseña exitosamente.",
    historial: [
      { accion: "Ticket creado",       usuario: "Sofía Mendoza",  detalle: "Ticket creado desde el portal",         fecha: new Date(Date.now() - 300 * 60000).toISOString() },
      { accion: "Ticket asignado",     usuario: "Carlos Méndez",  detalle: "Asignado a Carmen Díaz",               fecha: new Date(Date.now() - 290 * 60000).toISOString() },
      { accion: "Estado → EN PROCESO", usuario: "Carmen Díaz",    detalle: "Iniciando restablecimiento",           fecha: new Date(Date.now() - 280 * 60000).toISOString() },
      { accion: "Ticket cerrado",      usuario: "Carmen Díaz",    detalle: "Contraseña restablecida exitosamente", fecha: new Date(Date.now() - 250 * 60000).toISOString() },
    ]
  },
];

// ══════════════════════════════════
// FUNCIONES DE DATOS
// ══════════════════════════════════
function getTicketsPorTecnico(nombre) {
  return TICKETS.filter(t => t.tecnico === nombre);
}

function getTicketsActivos(nombre) {
  return TICKETS.filter(t => t.tecnico === nombre && (t.estado === "ASIGNADO" || t.estado === "EN_PROCESO"));
}

function getEstadisticas(filtrarPor = null) {
  let lista = filtrarPor ? TICKETS.filter(t => t.tecnico === filtrarPor || t.solicitante === filtrarPor) : TICKETS;
  return {
    total:     lista.length,
    creados:   lista.filter(t => t.estado === "CREADO").length,
    asignados: lista.filter(t => t.estado === "ASIGNADO").length,
    enProceso: lista.filter(t => t.estado === "EN_PROCESO").length,
    cerrados:  lista.filter(t => t.estado === "CERRADO").length,
    anulados:  lista.filter(t => t.estado === "ANULADO").length,
    inmediata: lista.filter(t => t.prioridad === "inmediata" && t.estado !== "CERRADO" && t.estado !== "ANULADO").length,
  };
}

function registrarHistorial(ticket, accion, detalle, usuario) {
  ticket.historial.push({ accion, usuario, detalle, fecha: ahora() });
}

// Rol efectivo (admin puede simular roles)
function getRolEfectivo() {
  return window.rolSimulado || usuarioActual.rol;
}
// ── Obtener sede de un usuario ──
function getSedeUsuario(usuario) {
  if (!usuario.sedeId) return null;
  return SEDES.find(s => s.id === usuario.sedeId) || null;
}

// ── Obtener tickets filtrados por sede ──
function getTicketsPorSede(sedeId) {
  if (!sedeId) return TICKETS;
  return TICKETS.filter(t => t.sedeId === sedeId);
}

// ── Obtener técnicos de una sede ──
function getTecnicosPorSede(sedeId) {
  return USUARIOS.filter(u =>
    (u.rol === "tecnico" || u.rol === "recepcionista") &&
    u.sedeId === sedeId
  );
}

// ── Estadísticas por sede ──
function getEstadisticasPorSede(sedeId) {
  let lista = sedeId ? TICKETS.filter(t => t.sedeId === sedeId) : TICKETS;
  return {
    total:     lista.length,
    creados:   lista.filter(t => t.estado === "CREADO").length,
    asignados: lista.filter(t => t.estado === "ASIGNADO").length,
    enProceso: lista.filter(t => t.estado === "EN_PROCESO").length,
    cerrados:  lista.filter(t => t.estado === "CERRADO").length,
    anulados:  lista.filter(t => t.estado === "ANULADO").length,
    inmediata: lista.filter(t => t.prioridad === "inmediata" && t.estado !== "CERRADO").length,
  };
}
