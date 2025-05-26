export default function ModalTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="absolute top-1/2 left-1/2 flex max-w-2xl min-w-xl -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-xl bg-neutral-900 px-4 py-8">
      {children}
    </div>
  );
}
