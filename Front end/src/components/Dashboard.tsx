import { useEffect, useState } from "react";
import { Users, FileText, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {

  const [stats, setStats] = useState({
    totalPacientes: 0,
    prontuariosHoje: 0,
    novosRegistros: 0,
  });

  const token = localStorage.getItem("token");

  // Buscar infos do backend
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:8080/dashboard/stats", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Erro ao buscar estatísticas");
          return;
        }

        const data = await response.json();
        setStats(data);

      } catch (err) {
        console.error("Erro no fetch:", err);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total de Pacientes",
      value: stats.totalPacientes,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Prontuários Hoje",
      value: stats.prontuariosHoje,
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Novos Registros (30 dias)",
      value: stats.novosRegistros,
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Novo Paciente */}
            <button
              onClick={() => onNavigate("patients")}
              className="p-4 border-2 border-dashed border-border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Users className="size-8 mb-2 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              <p className="font-medium">Cadastrar Paciente</p>
            </button>

            {/* Novo Prontuário */}
            <button
              onClick={() => onNavigate("prontuarios")}
              className="p-4 border-2 border-dashed border-border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <FileText className="size-8 mb-2 text-muted-foreground group-hover:text-green-600 transition-colors" />
              <p className="font-medium">Registrar Prontuário</p>
            </button>

          </div>
        </CardContent>
      </Card>

      {/* Estatísticas do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <Icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
