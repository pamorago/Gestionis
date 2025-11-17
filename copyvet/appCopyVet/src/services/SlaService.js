import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'sla';

class SlaService {
  list() {
    return axios.get(BASE_URL);
  }
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  create(sla) {
    return axios.post(BASE_URL, sla);
  }
  update(id, sla) {
    return axios.put(`${BASE_URL}/${id}`, sla);
  }
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new SlaService();
