import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'especialidad';

class SpecialtyService {
  list() {
    return axios.get(BASE_URL);
  }
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  create(specialty) {
    return axios.post(BASE_URL, specialty);
  }
  update(id, specialty) {
    return axios.put(`${BASE_URL}/${id}`, specialty);
  }
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new SpecialtyService();
