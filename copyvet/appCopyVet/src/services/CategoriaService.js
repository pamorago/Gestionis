import axios from 'axios';
const BASE_URL = import.meta.env.VITE_COPYVET_BASE_URL || `${window.location.origin}/copyvet/`;

class CategoriaService {
  list() { return axios.get(BASE_URL + 'categoria'); }
  get(id) { return axios.get(BASE_URL + 'categoria/' + id); }
}

export default new CategoriaService();