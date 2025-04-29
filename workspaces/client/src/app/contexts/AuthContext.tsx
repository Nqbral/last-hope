'use client';

import axios from '@lib/axiosInstance';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  isLoading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      await axios
        .post(process.env.NEXT_PUBLIC_WS_API_AUTH_URL + '/auth/refresh')
        .then((res) => {
          if (res.status == 201) {
            console.log('Log ok : ' + res.data.accessToken);
            setAccessToken(res.data.accessToken);
            return;
          }

          setAccessToken(null);
        })
        .catch((error) => {
          console.error('Erreur lors du refresh token', error);
          setAccessToken(null);
        });

      setIsLoading(false);
    };

    fetchAccessToken();
  }, []);

  const logout = async () => {
    await axios
      .post(process.env.NEXT_PUBLIC_WS_API_AUTH_URL + '/auth/logout')
      .then(() => {
        console.log('Logout ok');
        setAccessToken(null);
      })
      .catch((error) => {
        console.error('Erreur logout', error);
      });
  };

  return (
    <AuthContext.Provider value={{ accessToken, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
