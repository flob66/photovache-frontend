import { Injectable } from '@angular/core';
import axios from 'axios';

const API_URL = 'https://photovache-backend.onrender.com/vaches';

@Injectable({
  providedIn: 'root'
})
export class VacheService {

  constructor() { }

  getAll() {
    return axios.get(API_URL);
  }

  getByNumero(numero: string) {
    return axios.get(`${API_URL}?numero=${numero}`);
  }

  create(vache: any) {
    return axios.post(API_URL, vache);
  }

  update(id: number, vache: any) {
    return axios.put(`${API_URL}/${id}`, vache);
  }

  delete(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
}