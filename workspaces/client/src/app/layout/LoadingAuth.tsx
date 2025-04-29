'use client';

import { useAuth } from '@contexts/AuthContext';
import { Triangle } from 'react-loader-spinner';

export default function LoadingAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#2F9966"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}
