export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Admin panel has its own layout - no main site navigation */}
      {children}
    </div>
  );
}