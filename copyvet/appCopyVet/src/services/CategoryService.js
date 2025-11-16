import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || `${window.location.origin}/copyvet/`;

class CategoryService {
  // Obtener todas las categorías
  // GET: /copyvet/categoria
  list() { 
    return axios.get(BASE_URL + 'categoria'); 
  }
  
  // Obtener categoría por ID
  // GET: /copyvet/categoria/:id
  get(id) { 
    return axios.get(BASE_URL + 'categoria/' + id); 
  }
  
  // Crear nueva categoría
  // POST: /copyvet/categoria/create
  create(category) {
    return axios({
      method: 'post',
      url: BASE_URL + 'categoria/create',
      data: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Actualizar categoría existente
  // PUT: /copyvet/categoria
  update(category) {
    return axios({
      method: 'put',
      url: BASE_URL + 'categoria',
      data: JSON.stringify(category),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  
  // Eliminar categoría
  // DELETE: /copyvet/categoria/delete/:id
  delete(id) {
    return axios.delete(BASE_URL + 'categoria/delete/' + id);
  }

  // Obtener etiquetas de una categoría
  // GET: /copyvet/categoria/:id/etiquetas
  getEtiquetas(id) {
    return axios.get(BASE_URL + 'categoria/' + id + '/etiquetas');
  }
}

export default new CategoryService();