import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/copyvet/`;

class VeterinarioService {
  list() { return axios.get(BASE_URL + 'veterinario'); }
  get(id) { return axios.get(BASE_URL + 'veterinario/' + id); }
  getTickets(id) { return axios.get(BASE_URL + 'veterinario/tickets/' + id); }
}

export default new VeterinarioService();