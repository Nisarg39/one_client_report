export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
