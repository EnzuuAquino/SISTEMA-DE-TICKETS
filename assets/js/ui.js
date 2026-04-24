// ══════════════════════════════════
// FUNCIONES DE INTERFAZ - ServiceTIC
// ══════════════════════════════════

function badgeEstado(estado) {
  const clases = {
    "CREADO":     "badge-creado",
    "ASIGNADO":   "badge-asignado",
    "EN_PROCESO": "badge-en-proceso",
    "CERRADO":    "badge-cerrado",
    "ANULADO":    "badge-anulado",
  };
  const labels = {
    "CREADO":     "Creado",
    "ASIGNADO":   "Asignado",
    "EN_PROCESO": "En proceso",
    "CERRADO":    "Cerrado",
    "ANULADO":    "Anulado",
  };
  return `<span class="badge ${clases[estado] || ''}">${labels[estado] || estado}</span>`;
}

function badgePrioridad(prioridad) {
  const clases = {
    "baja":      "badge-baja",
    "media":     "badge-media",
    "alta":      "badge-alta",
    "inmediata": "badge-inmediata",
  };
  return `<span class="badge ${clases[prioridad] || ''}">${prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}</span>`;
}

function renderProgreso(estado) {
  const pasos = [
    { key: "CREADO",     label: "Creado" },
    { key: "ASIGNADO",   label: "Asignado" },
    { key: "EN_PROCESO", label: "En proceso" },
    { key: "CERRADO",    label: "Cerrado" },
  ];

  if (estado === "ANULADO") {
    return `<div style="text-align:center; padding:12px; background:#fff1f2; border-radius:8px; color:#991b1b; font-weight:600; font-size:13px;">
      <i class="fa-solid fa-ban"></i> Ticket Anulado
    </div>`;
  }

  const orden  = { "CREADO": 0, "ASIGNADO": 1, "EN_PROCESO": 2, "CERRADO": 3 };
  const actual = orden[estado] ?? 0;
  let html = '<div class="progreso-pasos">';

  pasos.forEach((paso, i) => {
    let claseCirculo = "";
    let claseLabel   = "";
    let contenido    = i + 1;

    if (i < actual) {
      claseCirculo = "completado";
      claseLabel   = "completado";
      contenido    = '<i class="fa-solid fa-check"></i>';
    } else if (i === actual) {
      claseCirculo = "activo";
      claseLabel   = "activo";
    }

    html += `
      <div class="paso">
        <div class="paso-circulo ${claseCirculo}">${contenido}</div>
        <span class="paso-label ${claseLabel}">${paso.label}</span>
      </div>
    `;
    if (i < pasos.length - 1) {
      html += `<div class="paso-linea ${i < actual ? 'completada' : ''}"></div>`;
    }
  });

  html += '</div>';
  return html;
}

/**
 * Renderiza la tarjeta de ticket. 
 * Ahora incluye correctamente la lógica de sedes sin errores de referencia.
 */
function renderTicketCardCompacta(ticket, botones = []) {
  // Buscar data de la sede internamente para evitar "ticket is not defined"
  const sedeData = (typeof SEDES !== 'undefined' && SEDES) ? SEDES.find(s => s.id === ticket.sedeId) : null;
  
  const badgeSedeHTML = sedeData 
    ? `<span style="background:${sedeData.color}22;color:${sedeData.color};border:1px solid ${sedeData.color}44;
        font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;">
        <i class="fa-solid fa-building" style="margin-right:3px;"></i>${sedeData.nombre}
       </span>` 
    : "";

  let botonesHTML = botones.map(b => {
    if (b.tipo === "atender") return `<button class="btn-atender" style="font-size:11px;padding:5px 10px;" onclick="event.stopPropagation();atenderTicket('${ticket.id}')"><i class="fa-solid fa-play"></i> Atender</button>`;
    if (b.tipo === "tomar")   return `<button class="btn-tomar"   style="font-size:11px;padding:5px 10px;" onclick="event.stopPropagation();tomarTicket('${ticket.id}')"><i class="fa-solid fa-hand"></i> Tomar</button>`;
    if (b.tipo === "delegar") return `<button class="btn-outline" style="font-size:11px;padding:5px 10px;" onclick="event.stopPropagation();abrirModalDelegar('${ticket.id}')"><i class="fa-solid fa-share-nodes"></i> Delegar</button>`;
    return "";
  }).join("");

  return `
    <div class="ticket-card-compacta prioridad-${ticket.prioridad} ${ticket.estado==='ANULADO'?'ticket-anulado':''}"
         onclick="verTicket('${ticket.id}')" style="cursor:pointer;">
      <div class="tcc-header">
        <span class="tcc-id">#${ticket.id}</span>
        ${badgeEstado(ticket.estado)}
        ${badgePrioridad(ticket.prioridad)}
        ${badgeSedeHTML}
      </div>
      <div class="tcc-titulo">${ticket.titulo}</div>
      <div class="tcc-desc">${ticket.descripcion}</div>
      ${renderProgreso(ticket.estado)}
      <div class="tcc-meta">
        <span><i class="fa-solid fa-user"></i> ${ticket.tecnico || "Sin asignar"}</span>
        <span><i class="fa-solid fa-building"></i> ${ticket.departamento}</span>
        <span><i class="fa-solid fa-clock"></i> ${tiempoTranscurrido(ticket.creadoEn)}</span>
      </div>
      ${botonesHTML ? `<div class="tcc-acciones" onclick="event.stopPropagation()">${botonesHTML}</div>` : ""}
    </div>
  `;
}

function abrirModal(id) {
  document.getElementById(id).classList.remove("oculto");
  document.getElementById("overlay-modal").classList.remove("oculto");
}

function cerrarModal(id) {
  document.getElementById(id).classList.add("oculto");
  document.getElementById("overlay-modal").classList.add("oculto");
}

function navegarA(pagina) {
  document.querySelectorAll(".pagina").forEach(p => {
    p.classList.remove("activa");
    p.classList.add("oculto");
  });

  let paginaEl = document.getElementById("pagina-" + pagina);
  if (paginaEl) {
    paginaEl.classList.remove("oculto");
    paginaEl.classList.add("activa");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("activo");
    if (item.dataset.pagina === pagina) item.classList.add("activo");
  });

  const titulos = {
    "dashboard":     ["Dashboard",           "Panel de Control"],
    "mis-tickets":   ["Mis Tickets",         "Resumen de tu actividad"],
    "depto-tickets": ["Tickets del Departamento", "Todos los tickets del equipo"],
    "todos-tickets": ["Todos los Tickets",   "Vista completa del sistema"],
    "soluciones":    ["Centro de Soluciones",  "Base de conocimiento"],
    "reportes":      ["Reportes y Análisis", "Métricas de desempeño"],
    "detalle":       ["Detalle del Ticket",  "Información completa"],
    "sedes":         ["Gestión de Sedes",    "Resumen por ubicación"]
  };

  if (titulos[pagina]) {
    document.getElementById("topbar-titulo").textContent    = titulos[pagina][0];
    document.getElementById("topbar-subtitulo").textContent = titulos[pagina][1];
  }
}

function renderVacio(mensaje) {
  return `<div class="vacio"><i class="fa-solid fa-inbox"></i>${mensaje}</div>`;
}

function llenarSelectTecnicos(selectId, excluir = null) {
  let select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">Seleccione un técnico</option>';
  USUARIOS.filter(u => u.rol === "tecnico" && u.nombre !== excluir).forEach(u => {
    select.innerHTML += `<option value="${u.nombre}">${u.nombre} — ${u.cargo}</option>`;
  });
}

function renderAccesoRestringido(ticket) {
  return `
    <div class="card" style="background:#fffbeb; border-color:#fde68a; text-align:center; padding:32px;">
      <div style="width:56px;height:56px;background:#fef3c7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <i class="fa-solid fa-user-lock" style="font-size:24px;color:#d97706;"></i>
      </div>
      <h3 style="font-size:16px;font-weight:700;color:#92400e;margin-bottom:8px;">Acceso Restringido</h3>
      <p style="font-size:13px;color:#b45309;">
        Este ticket está asignado a <strong>${ticket.tecnico}</strong>.<br>
        Solo el técnico asignado puede cerrar este ticket o cargar archivos.
      </p>
    </div>
  `;
}

// ══════════════════════════════════
// SISTEMA DE TOASTS
// ══════════════════════════════════
const TOAST_ICONOS = {
  exito:  "fa-circle-check",
  error:  "fa-circle-xmark",
  alerta: "fa-triangle-exclamation",
  info:   "fa-circle-info",
};

function toast(tipo, titulo, mensaje, duracion = 4000) {
  let contenedor = document.getElementById("toast-container");
  if(!contenedor) return;
  
  let id = "toast-" + Date.now();
  let el = document.createElement("div");
  el.className = `toast ${tipo}`;
  el.id = id;
  el.innerHTML = `
    <div class="toast-icono">
      <i class="fa-solid ${TOAST_ICONOS[tipo] || 'fa-circle-info'}"></i>
    </div>
    <div class="toast-contenido">
      <div class="toast-titulo">${titulo}</div>
      <div class="toast-mensaje">${mensaje}</div>
    </div>
    <button class="toast-cerrar" onclick="cerrarToast('${id}')">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="toast-barra"></div>
  `;
  contenedor.appendChild(el);
  setTimeout(() => cerrarToast(id), duracion);
}

function cerrarToast(id) {
  let el = document.getElementById(id);
  if (!el) return;
  el.classList.add("saliendo");
  setTimeout(() => el.remove(), 300);
}

// ══════════════════════════════════
// SECCIÓN APUNTES
// ══════════════════════════════════

function renderizarSeccionApuntes(apuntes) {
  if (!apuntes || apuntes.length === 0) {
    return `
      <div class="seccion-apuntes">
        <div class="apuntes-header-unificado">
          <h3><i class="fa-solid fa-note-sticky" style="color:#f59e0b;"></i> Mis Apuntes</h3>
          <button class="btn-primary" onclick="abrirModal('modal-apuntes')"><i class="fa-solid fa-plus"></i> Nuevo Apunte</button>
        </div>
        <div class="vacio-apuntes">No tienes apuntes pendientes.</div>
      </div>`;
  }

  return `
    <div class="seccion-apuntes">
      <div class="apuntes-header-unificado">
        <h3><i class="fa-solid fa-note-sticky" style="color:#f59e0b;"></i> Mis Apuntes</h3>
        <button class="btn-primary" onclick="abrirModal('modal-apuntes')"><i class="fa-solid fa-plus"></i> Nuevo Apunte</button>
      </div>
      <div id="lista-apuntes-unificada">
        ${apuntes.map(apunte => `
          <div class="apunte-item-unificado" id="apunte-${apunte.id}">
            <div class="apunte-cuerpo">
              <div class="apunte-info">
                <strong>${apunte.titulo}</strong>
                <p>${apunte.descripcion || ''}</p>
                <div class="apunte-meta">
                    <span class="badge-prioridad-${apunte.prioridad || 'normal'}">${apunte.prioridad || 'normal'}</span>
                    <span><i class="fa-regular fa-clock"></i> ${apunte.hora || ''}</span>
                </div>
              </div>
              <button class="btn-realizado" onclick="accionMarcarRealizado('${apunte.id}')">
                <i class="fa-solid fa-check"></i> Realizado
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function accionMarcarRealizado(id) {
  const elemento = document.getElementById(`apunte-${id}`);
  if (!elemento) return;
  elemento.classList.add('completado');
  toast('exito', '¡Buen trabajo!', 'Apunte marcado como realizado.');
  setTimeout(() => {
    elemento.classList.add('fade-out-apunte');
    setTimeout(() => {
      elemento.remove();
    }, 400);
  }, 600);
}
