import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WS_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');
  let token = undefined;

  if (userString != undefined) {
    token = JSON.parse(userString).accessToken;
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axiosInstance.post('/auth/refresh');
        const newAccessToken = refreshRes.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        console.log(e);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
