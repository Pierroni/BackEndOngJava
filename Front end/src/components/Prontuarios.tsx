import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ProntuarioForm } from "./ProntuarioForm";
import { toast } from "sonner";

interface Prontuario {
  id: number;
  consulta: string;
  sintomas: string;
  diagnostico: string;
  exames: string;
  dataRegistro: string;
  paciente?: {
    id: number;
    nomePas: string;
  };
}

export function Prontuarios() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showProntuarioForm, setShowProntuarioForm] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState<Prontuario | null>(null);
  const [deletingProntuario, setDeletingProntuario] = useState<Prontuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  // ========================================
  // 1. Buscar registros de consultas do backend
  // ========================================
  async function loadProntuarios() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // URL da sua API para RegistroConsultas
      const response = await fetch("http://localhost:8080/registro-consultas", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      // CORREÇÃO: Renomeie para evitar conflito de nomes
      const responseData = await response.json();
      console.log("Dados da API RegistroConsultas:", responseData);

      // Converter backend → frontend conforme sua entidade
      const formatted = Array.isArray(responseData) ? responseData
        .filter((item: any) => item != null)
        .map((item: any) => ({
          id: Number(item.id) || 0,
          consulta: item.consulta || "",
          sintomas: item.sintomas || "",
          diagnostico: item.diagnostico || "",
          exames: item.exames || "",
          dataRegistro: item.dataRegistro || item.dataConsulta || "",
          // Se sua API retornar dados do paciente junto
          paciente: item.paciente || null,
        }))
        .filter(p => p.id > 0) : [];

      console.log("Prontuários formatados:", formatted);
      setProntuarios(formatted);

    } catch (err: any) {
      console.error("Erro ao carregar registros:", err);
      toast.error(err.message || "Falha ao carregar registros de consultas");
      setProntuarios([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProntuarios();
  }, []);

  // ========================================
  // 2. Salvar registro (create/update)
  // ========================================
  async function handleSaveProntuario(prontuarioData: any) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      console.log("Dados recebidos do formulário:", prontuarioData);

      // Preparar payload no formato da sua entidade RegistroConsultas
      const payload = {
        consulta: prontuarioData.consulta || "",
        sintomas: prontuarioData.sintomas || "",
        diagnostico: prontuarioData.diagnostico || "",
        exames: prontuarioData.exames || "",
        dataRegistro: prontuarioData.dataRegistro || prontuarioData.dataConsulta || new Date().toISOString().split('T')[0],
      };

      console.log("Payload enviado para API:", payload);

      let response;
      let url = "http://localhost:8080/registro-consultas";
      
      if (editingProntuario) {
        // UPDATE
        url = `http://localhost:8080/registro-consultas/${editingProntuario.id}`;
        response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Resposta da API:", result);

      toast.success(editingProntuario ? "Registro atualizado!" : "Registro criado!");
      
      setShowProntuarioForm(false);
      setEditingProntuario(null);
      loadProntuarios(); // Recarrega a lista
      
    } catch (err: any) {
      console.error("Erro ao salvar registro:", err);
      toast.error(err.message || "Erro ao salvar registro");
    }
  }

  // ========================================
  // 3. Deletar registro
  // ========================================
  async function handleDeleteProntuario() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/registro-consultas/${deletingProntuario?.id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      toast.success("Registro excluído!");
      setDeletingProntuario(null);
      loadProntuarios();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao excluir registro");
    }
  }

  // ========================================
  // 4. FILTROS
  // ========================================
  const filteredProntuarios = prontuarios.filter((prontuario) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      prontuario.consulta?.toLowerCase().includes(searchLower) ||
      prontuario.diagnostico?.toLowerCase().includes(searchLower) ||
      prontuario.sintomas?.toLowerCase().includes(searchLower) ||
      prontuario.id.toString().includes(searchQuery);

    let matchesDate = true;
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      matchesDate = prontuario.dataRegistro === today;
    } else if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(prontuario.dataRegistro) >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(prontuario.dataRegistro) >= monthAgo;
    }

    return matchesSearch && matchesDate;
  });

  // Função para formatar exames (string para array se necessário)
  const formatExames = (examesString: string) => {
    if (!examesString) return [];
    // Tenta dividir por vírgula, ponto e vírgula ou nova linha
    return examesString.split(/[,;\n]/)
      .map(exame => exame.trim())
      .filter(exame => exame.length > 0);
  };

  // ========================================
  // RENDER
  // ========================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Registros de Consultas</h1>
          <p className="text-muted-foreground">
            Gerencie todos os registros médicos
          </p>
        </div>
        <Button onClick={() => setShowProntuarioForm(true)}>
          <Plus className="size-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por consulta, diagnóstico ou sintomas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as datas</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Consulta</TableHead>
              <TableHead>Sintomas</TableHead>
              <TableHead>Diagnóstico</TableHead>
              <TableHead>Exames</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProntuarios.map((prontuario) => {
              const examesArray = formatExames(prontuario.exames);
              
              return (
                <TableRow key={prontuario.id}>
                  <TableCell className="font-mono text-sm">
                    #{prontuario.id}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {prontuario.consulta || "Consulta geral"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm truncate max-w-xs">
                      {prontuario.sintomas || "Sem sintomas"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm truncate max-w-xs">
                      {prontuario.diagnostico || "Sem diagnóstico"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {examesArray.slice(0, 2).map((exame, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {exame}
                        </Badge>
                      ))}
                      {examesArray.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{examesArray.length - 2}
                        </Badge>
                      )}
                      {examesArray.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          Nenhum
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {prontuario.dataRegistro 
                          ? new Date(prontuario.dataRegistro).toLocaleDateString("pt-BR")
                          : "Não informada"}
                    </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProntuario(prontuario);
                          setShowProntuarioForm(true);
                        }}
                        title="Editar"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingProntuario(prontuario)}
                        title="Excluir"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {showProntuarioForm && (
  <ProntuarioForm
    prontuario={editingProntuario}
    onSave={handleSaveProntuario}
    onClose={() => {
      setShowProntuarioForm(false);
      setEditingProntuario(null);
    }}
  />
)}

        {filteredProntuarios.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="size-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum registro encontrado</p>
            {prontuarios.length === 0 && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={loadProntuarios}
              >
                Tentar novamente
              </Button>
            )}
          </div>
        )}
      </div>


      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingProntuario}
        onOpenChange={(open) => !open && setDeletingProntuario(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o registro #{deletingProntuario?.id}{" "}
              de consulta <strong>"{deletingProntuario?.consulta}"</strong>? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProntuario}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}