'use client';

import plainAxios from '@lib/plainAxios';
import { useEffect, useState } from 'react';

export default function ErrorMessage() {
  const [titleError, setTitleError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const getMessage = async () => {
    try {
      const res = await plainAxios.get(
        process.env.NEXT_PUBLIC_WS_API_AUTH_URL + '/message_error/message',
      );

      if (res.status == 200 && res.data != '') {
        setTitleError(res.data.title);
        setMessageError(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessage();
  });

  if (titleError && messageError) {
    return (
      <div className="flex w-72 flex-col items-center gap-3 rounded-lg border-1 border-amber-400 p-4 text-center sm:w-xl md:w-2xl">
        <h2 className="text-lg font-bold text-amber-400 sm:text-xl">
          {titleError}
        </h2>
        <p className="text-center text-sm text-amber-200 sm:text-base">
          {messageError}
        </p>
      </div>
    );
  }
  return <></>;
}
