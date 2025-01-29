import axios from 'axios';
import { PrescriptionRequest, PrescriptionResponse } from '../models/prescription';
import Cookies from 'js-cookie'; 

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string;
  }
}

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Token bulunamadı, kimlik doğrulama başarısız olabilir.');
  }
  return config;
});

export const prescriptionApi = {

  create: async (data: PrescriptionRequest): Promise<PrescriptionResponse> => {
    const response = await apiClient.post<PrescriptionResponse>('/prescriptions/v1', data);
    return response.data;
  },

  submit: (id: number): Promise<PrescriptionResponse> =>
    apiClient.put(`/prescriptions/v1/${id}/submit`),

  getIncomplete: (date: string): Promise<PrescriptionResponse[]> =>
    apiClient.get(`/prescriptions/v1/incomplete?date=${date}`),

  getVisit: (id: number) =>
    apiClient.get(`/prescriptions/v1/visits/${id}`),

  getMedicines: (query: string) =>
    apiClient.get(`/medicines/v1/search?query=${query}`),

  uploadMedicines: () =>
    apiClient.post('/medicines/v1/upload'),

  updateCache: () =>
    apiClient.post('/medicines/v1/cache'),

  getMedicineById: (id: string) =>
    apiClient.get(`/medicines/v1/${id}`),
};
