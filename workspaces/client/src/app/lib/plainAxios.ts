// src/lib/plainAxios.ts
import axios from 'axios';

const plainAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WS_API_AUTH_URL,
  withCredentials: true,
});

export default plainAxios;
