import axios from 'axios'; const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; const client = axios.create({ baseURL: API, headers:{'Content-Type':'application/json'} });
export const fetchExperiences = (search?:string) => client.get('/experiences', { params: { search } });
export const fetchExperienceById = (id:number) => client.get(`/experiences/${id}`);
export const validatePromo = (code:string, amount:number) => client.post('/promo/validate', { code, amount });
export const createBooking = (payload:any) => client.post('/bookings', payload);
export default client;