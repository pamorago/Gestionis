import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/copyvet/`;

class DashboardService {
  getEstadisticas() { 
    return axios.get(BASE_URL + 'dashboard/getEstadisticas'); 
  }
}

export default new DashboardService();
