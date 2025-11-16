import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/copyvet/`;

class VeterinarioService {
  list() { return axios.get(BASE_URL + 'veterinario'); }
  get(id) { return axios.get(BASE_URL + 'veterinario/' + id); }
  getTickets(id) { return axios.get(BASE_URL + 'veterinario/tickets/' + id); }
  create(data) { return axios.post(BASE_URL + 'veterinario', data); }
  update(data) { return axios.put(BASE_URL + 'veterinario', data); }
  delete(id) { return axios.delete(BASE_URL + 'veterinario/' + id); }
}

export default new VeterinarioService();