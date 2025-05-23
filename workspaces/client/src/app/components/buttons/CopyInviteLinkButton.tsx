'use client';

import { useState } from 'react';

import SecondaryButton from './SecondaryButton';

export default function CopyInviteLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const inviteUrl = window.location.href;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <SecondaryButton
      buttonText={copied ? 'Lien copié !' : 'Copier lien invitation'}
      onClick={handleCopy}
    />
  );
}
