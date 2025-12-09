import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || window.location.origin + '/copyvet/';

const NotificacionService = {
  // Obtener todas las notificaciones del usuario
  getByUsuario: (id_usuario) => {
    if (!id_usuario) {
      console.warn('NotificacionService.getByUsuario: id_usuario is empty or undefined');
      return Promise.reject(new Error('ID de usuario no proporcionado'));
    }
    const url = `${BASE_URL}notificacion?id_usuario=${id_usuario}`;
    console.log('NotificacionService.getByUsuario URL:', url, 'id_usuario:', id_usuario);
    return axios.get(url);
  },

  // Obtener notificaciones no leídas
  getNoLeidas: (id_usuario) => {
    return axios.get(`${BASE_URL}notificacion/getNoLeidas/${id_usuario}`);
  },

  // Contar notificaciones no leídas
  contarNoLeidas: (id_usuario) => {
    if (!id_usuario) {
      console.warn('NotificacionService.contarNoLeidas: id_usuario is empty or undefined');
      return Promise.reject(new Error('ID de usuario no proporcionado'));
    }
    return axios.get(`${BASE_URL}notificacion/contarNoLeidas/${id_usuario}`);
  },

  // Obtener una notificación específica
  get: (id_notificacion) => {
    return axios.get(`${BASE_URL}notificacion/${id_notificacion}`);
  },

  // Crear una notificación
  create: (notificacion) => {
    return axios.post(`${BASE_URL}notificacion`, notificacion, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Actualizar una notificación
  update: (id_notificacion, data) => {
    return axios.put(`${BASE_URL}notificacion/${id_notificacion}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Eliminar una notificación
  delete: (id_notificacion) => {
    return axios.delete(`${BASE_URL}notificacion/${id_notificacion}`);
  },

  // Marcar como leída
  marcarComoLeida: (id_notificacion, id_usuario) => {
    return axios.post(`${BASE_URL}notificacion/marcarComoLeida/${id_notificacion}`, {
      id_usuario
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Marcar todas como leídas
  marcarTodasComoLeidas: (id_usuario) => {
    return axios.post(`${BASE_URL}notificacion/marcarTodasComoLeidas`, {
      id_usuario
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // Obtener por tipo
  getByTipo: (id_usuario, tipo) => {
    return axios.get(`${BASE_URL}notificacion/getByTipo/${id_usuario}/${tipo}`);
  }
};

export default NotificacionService;
