
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import SidebarToggle from "@/components/admin/SidebarToggle";
import { SidebarProvider } from "@/lib/context/SidebarContext";

export const metadata = {
  title: 'GM Atelier — Admin Dashboard',
  description: 'Management portal for GM Atelier',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
  <div className="-mt-16 sm:-mt-20 min-h-screen flex bg-zinc-50 font-sans text-zinc-900">
    <AdminSidebar />

    <div className="flex-1 flex flex-col min-w-0 bg-white min-h-screen border-l border-zinc-200">
      <header className="h-16 px-4 sm:px-8 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <SidebarToggle />

          <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600 font-semibold">
            GM ATELIER // SYSTEM v1.0
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-bold bg-black text-white rounded">
            ADMIN MODE
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  </div>
</SidebarProvider>
  );
}
