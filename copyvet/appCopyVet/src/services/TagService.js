import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'etiqueta';

class TagService {
  list() {
    return axios.get(BASE_URL);
  }
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
  create(tag) {
    return axios.post(BASE_URL, tag);
  }
  update(id, tag) {
    return axios.put(`${BASE_URL}/${id}`, tag);
  }
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new TagService();
