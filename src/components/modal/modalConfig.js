export const modalConfig = {
  task: {
    title: 'Añadir Nueva Tarea',
    fields: [
      { key: 'title', label: 'Título de la tarea', placeholder: 'Ej. Revisar tema 3', required: true },
      { key: 'subtitle', label: 'Categoría', placeholder: 'Ej. Universidad / Hogar' },
      { key: 'val1', label: 'Fecha de vencimiento', type: 'date' },
      { key: 'val2', label: 'Notas adicionales', placeholder: 'Opcional' },
    ],
  },
  delivery: {
    title: 'Añadir Entrega de Ingeniería',
    fields: [
      { key: 'title', label: 'Nombre de la entrega', placeholder: 'Ej. Práctica 2', required: true },
      { key: 'subtitle', label: 'Asignatura', placeholder: 'Ej. Bases de Datos' },
      { key: 'val1', label: 'Fecha de entrega', placeholder: 'Ej. 25 Octubre' },
      { key: 'val2', label: 'Progreso inicial (%)', placeholder: 'Ej. 20', type: 'number' },
    ],
  },
  expense: {
    title: 'Registrar Nuevo Gasto',
    fields: [
      { key: 'title', label: 'Concepto / nombre', placeholder: 'Ej. Compra Mercadona', required: true },
      { key: 'subtitle', label: 'Categoría', placeholder: 'Ej. Supermercado' },
      { key: 'val1', label: 'Importe en €', placeholder: 'Ej. 45.90', type: 'number', required: true, step: '0.01' },
      { key: 'val2', label: 'Fecha', placeholder: 'Hoy' },
    ],
  },
  event: {
    title: 'Añadir Próximo Evento',
    fields: [
      { key: 'title', label: 'Título del evento', placeholder: 'Ej. Tutoría', required: true },
      { key: 'subtitle', label: 'Etiqueta', placeholder: 'Ej. Universidad / Trabajo' },
      { key: 'val1', label: 'Fecha y hora', type: 'datetime-local', required: true },
    ],
  },
  subscription: {
    title: 'Añadir Renovación / Suscripción',
    fields: [
      { key: 'title', label: 'Servicio', placeholder: 'Ej. Netflix', required: true },
      { key: 'subtitle', label: 'Fecha de renovación', placeholder: 'Ej. 30 Octubre' },
      { key: 'val1', label: 'Precio en €', placeholder: 'Ej. 12.99', type: 'number', step: '0.01' },
      { key: 'val2', label: 'Icono FontAwesome', placeholder: 'fa-tv' },
    ],
  },
}
