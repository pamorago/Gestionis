import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'mascota';

class MascotaService {
  list() {
    return axios.get(BASE_URL);
  }

  get(id) {
    return axios.get(BASE_URL + '/' + id);
  }

  create(mascota) {
    return axios.post(BASE_URL, mascota, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  update(id, mascota) {
    return axios.put(BASE_URL + '/' + id, mascota, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  delete(id) {
    return axios.delete(BASE_URL + '/' + id);
  }
}

export default new MascotaService();
