import axios from 'axios';

// Prefer explicit environment variable, otherwise fall back to current origin + /copyvet/
const DEFAULT_BASE = `${window.location.origin}/copyvet/`;
const BASE_URL = import.meta.env.VITE_COPYVET_BASE_URL || DEFAULT_BASE;

class CopyVetService {
  getUsers() {
    return axios.get(BASE_URL + 'user');
  }
  getTickets() {
    return axios.get(BASE_URL + 'ticket');
  }
  getMascotas() {
    return axios.get(BASE_URL + 'mascota');
  }
}

export default new CopyVetService();
