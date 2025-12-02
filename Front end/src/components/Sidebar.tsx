import { Home, Users, FileText, Settings, LogOut, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "patients", label: "Pacientes", icon: Users },
    { id: "prontuarios", label: "Prontuários", icon: FileText },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-[#38B2AC] text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Heart className="size-8" />
          <div>
            <h2 className="text-white">Caminhar</h2>
            <p className="text-white/70 text-sm">Sistema de Prontuários</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#81E6D9] text-[#234E52] shadow-lg font-medium"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white"
          onClick={onLogout}
        >
          <LogOut className="size-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}