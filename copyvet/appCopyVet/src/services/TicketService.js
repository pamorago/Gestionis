import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/copyvet/`;

class TicketService {
  list() { return axios.get(BASE_URL + 'ticket'); }
  get(id) { return axios.get(BASE_URL + 'ticket/' + id); }
  listByRole(role, userId) {
    return axios.get(`${BASE_URL}ticket/getByRol/${encodeURIComponent(role)}/${userId}`);
  }
  getHistorico(id) { return axios.get(BASE_URL + 'ticket/getHistorico/' + id); }
  create(payload) { return axios.post(BASE_URL + 'ticket', payload); }
}

export default new TicketService();