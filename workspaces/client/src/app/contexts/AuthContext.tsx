'use client';

import axios from '@lib/axiosInstance';
import plainAxios from '@lib/plainAxios';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
  userName: string | null;
  isLoading: boolean;
  isLogged: boolean | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  userName: null,
  isLoading: true,
  isLogged: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  const authenticate = async () => {
    try {
      const res = await plainAxios.post('/auth/refresh', {
        withCredentials: true,
      });

      if (res.status === 201) {
        setAccessToken(res.data.accessToken);
        setIsLogged(true);
        localStorage.setItem('accessToken', res.data.accessToken);

        // Récupération du profil seulement si refresh réussi
        try {
          const profileRes = await axios.get('/user/profile', {
            withCredentials: true,
          });

          if (profileRes.status === 200) {
            setUserName(profileRes.data.username);
          } else {
            setUserName(null);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil', error);
          setUserName(null);
        }
      } else {
        setIsLogged(false);
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Erreur lors du refresh token', error);
      setIsLogged(false);
      setAccessToken(null);
      setUserName(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await plainAxios
          .get(process.env.NEXT_PUBLIC_WS_API_AUTH_URL + '/auth/verify_token', {
            withCredentials: true,
          })
          .then((res) => {
            if (res.status == 200) {
              return;
            }

            localStorage.removeItem('accessToken');
            setUserName(null);
            setAccessToken(null);
            setIsLogged(false);
          });
      } catch (error) {
        console.log(error);
        console.log('tentative refresh');
        authenticate();
      }
    };

    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  useEffect(() => {
    authenticate();
  }, []);

  const logout = async () => {
    try {
      await axios
        .post(process.env.NEXT_PUBLIC_WS_API_AUTH_URL + '/auth/logout', {
          withCredentials: true,
        })
        .then(() => {
          localStorage.removeItem('accessToken');
          setIsLogged(false);
          setAccessToken(null);
        });
    } catch (error) {
      console.error('Erreur logout', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, userName, isLoading, isLogged, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
