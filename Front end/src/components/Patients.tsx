import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, UserPlus } from "lucide-react";
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
import { Avatar, AvatarFallback } from "./ui/avatar";
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
import { PatientForm } from "./PatientForm";
import { toast } from "sonner";

interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  age: number;
  phone: string;
  cep: string;
  deceased: boolean;
  address?: string;
  observations?: string;
}

interface PatientsProps {
  onViewPatient: (patientId: string) => void;
}

export function Patients({ onViewPatient }: PatientsProps) {
  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deceasedFilter, setDeceasedFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // ========================================
  // 1. Buscar todos os pacientes do backend
  // ========================================
  async function loadPatients() {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const response = await fetch("http://localhost:8080/pacientes", {
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
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // DEBUG: Log completo da resposta
    console.log("Resposta completa da API:", data);

    // VALIDAÇÃO: Garantir que os dados estão corretos
    if (!Array.isArray(data)) {
      console.error("Dados retornados não são um array:", data);
      setPatients([]);
      return;
    }

    // Converter backend → frontend - TESTE TODAS AS POSSIBILIDADES
    const formatted = data
      .filter((p: any) => p != null)
      .map((p: any) => {
        // DEBUG: Verifique todos os campos do paciente
        console.log("Processando paciente ID:", p.id);
        console.log("Campos disponíveis:", Object.keys(p));
        
        // Tente encontrar o nome em diferentes campos possíveis
        let nome = "";
        const camposPossiveis = [
          'nomePas', 'nomepas', 'nome', 'Nome', 
          'nomePaciente', 'nomepaciente', 'NOME',
          'nome_completo', 'nomeCompleto'
        ];
        
        for (const campo of camposPossiveis) {
          if (p[campo] && typeof p[campo] === 'string') {
            nome = p[campo];
            console.log(`Nome encontrado no campo "${campo}":`, nome);
            break;
          }
        }
        
        // Se não encontrou, mostre todos os valores string
        if (!nome) {
          console.log("Nome não encontrado. Valores string disponíveis:");
          Object.entries(p).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim().length > 0) {
              console.log(`  ${key}: ${value}`);
            }
          });
        }

        return {
          id: Number(p.id) || 0,
          name: nome.trim() || "Nome não informado",
          cpf: String(p.cpf || "").trim(),
          birthDate: p.dataNascimento || "",
          age: p.dataNascimento ? calculateAge(p.dataNascimento) : 0,
          phone: String(p.telefone || "").trim(),
          cep: String(p.cep || "").trim(),
          address: String(p.endereco || "").trim(),
          observations: String(p.observacoes || "").trim(),
          deceased: Boolean(p.obito || false),
        };
      })
      .filter(p => p.id > 0);

    console.log("Pacientes formatados:", formatted);
    setPatients(formatted);
  } catch (err) {
    console.error("Erro ao carregar pacientes:", err);
    toast.error("Falha ao carregar pacientes");
    setPatients([]);
  } finally {
    setLoading(false);
  }
}

  // Função para calcular idade
  const calculateAge = (birthDate: string) => {
    try {
      if (!birthDate) return 0;
      
      const today = new Date();
      const birth = new Date(birthDate);
      
      if (isNaN(birth.getTime())) return 0;
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch (err) {
      return 0;
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // ========================================
  // 2. Salvar paciente (create/update) - CORRIGIDO
  // ========================================
  async function handleSavePatient(formData: any) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // DEBUG: Ver o que está chegando
      console.log("Dados recebidos do formulário:", formData);

      // Preparar payload no formato que o backend espera
      const payload = {
        nomePas: formData.nomePas || formData.name || "",
        cpf: formData.cpf || "",
        dataNascimento: formData.dataNascimento || formData.birthDate || "",
        telefone: formData.telefone || formData.phone || "",
        cep: formData.cep || "",
        endereco: formData.endereco || formData.address || "",
        observacoes: formData.observacoes || formData.observations || "",
        obito: Boolean(formData.obito || formData.deceased || false),
      };

      console.log("Payload enviado para API:", payload);

      let response;
      
      if (editingPatient) {
        // UPDATE
        response = await fetch(`http://localhost:8080/pacientes/${editingPatient.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        response = await fetch("http://localhost:8080/pacientes", {
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

      toast.success(editingPatient ? "Paciente atualizado!" : "Paciente cadastrado!");
      
      setShowPatientForm(false);
      setEditingPatient(null);
      loadPatients(); // Recarrega a lista
      
    } catch (err) {
      console.error("Erro ao salvar paciente:", err);
      toast.error("Erro ao salvar paciente. Verifique o console para detalhes.");
    }
  }

  // ========================================
  // 3. Deletar paciente
  // ========================================
  async function handleDeletePatient() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/pacientes/${deletingPatient?.id}`, {
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
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      toast.success("Paciente excluído!");
      setDeletingPatient(null);
      loadPatients();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir paciente");
    }
  }

  // ========================================
  // 4. FILTROS - COM PROTEÇÃO TOTAL
  // ========================================
  const filteredPatients = patients.filter((patient) => {
    if (!patient) return false;
    
    const name = String(patient?.name || "").toLowerCase();
    const cpf = String(patient?.cpf || "");
    const age = Number(patient?.age || 0);
    const deceased = Boolean(patient?.deceased || false);
    const searchLower = String(searchQuery || "").toLowerCase();
    
    const matchesSearch = 
      name.includes(searchLower) || 
      cpf.includes(searchQuery);
    
    const matchesDeceased =
      deceasedFilter === "all" ||
      (deceasedFilter === "yes" && deceased) ||
      (deceasedFilter === "no" && !deceased);
    
    let matchesAge = true;
    if (ageFilter === "0-18") matchesAge = age < 18;
    else if (ageFilter === "18-40") matchesAge = age >= 18 && age <= 40;
    else if (ageFilter === "40-60") matchesAge = age > 40 && age <= 60;
    else if (ageFilter === "60+") matchesAge = age > 60;
    
    return matchesSearch && matchesDeceased && matchesAge;
  });

  // ========================================
  // RENDER
  // ========================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Pacientes</h1>
          <p className="text-muted-foreground">Gerencie todos os pacientes cadastrados</p>
        </div>
        <Button onClick={() => setShowPatientForm(true)}>
          <Plus className="mr-2 size-4" />
          Novo Paciente
        </Button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={deceasedFilter} onValueChange={setDeceasedFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Óbito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="no">Não óbito</SelectItem>
            <SelectItem value="yes">Óbito</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Faixa etária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas idades</SelectItem>
            <SelectItem value="0-18">0-18 anos</SelectItem>
            <SelectItem value="18-40">18-40 anos</SelectItem>
            <SelectItem value="40-60">40-60 anos</SelectItem>
            <SelectItem value="60+">60+ anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CEP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPatients.map((patient) => {
              const name = String(patient?.name || "Sem nome");
              const initials = name.charAt(0).toUpperCase() || "?";
              
              return (
                <TableRow key={patient.id || Math.random()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-sm">
                    {patient.cpf || "Não informado"}
                  </TableCell>
                  <TableCell>{patient.age || 0} anos</TableCell>
                  <TableCell>{patient.phone || "Não informado"}</TableCell>
                  <TableCell>{patient.cep || "Não informado"}</TableCell>

                  <TableCell>
                    <Badge variant={patient.deceased ? "destructive" : "default"}>
                      {patient.deceased ? "Óbito" : "Ativo"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log("Botão editar clicado para paciente:", patient.id, patient.name);
                          setEditingPatient(patient);
                          setShowPatientForm(true);
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingPatient(patient)}
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

        {filteredPatients.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {patients.length === 0 
              ? "Nenhum paciente cadastrado" 
              : "Nenhum paciente encontrado com os filtros atuais"}
          </div>
        )}
      </div>

      {/* FORM */}
      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onClose={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
        />
      )}

      {/* CONFIRMAR EXCLUSÃO */}
      <AlertDialog
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja excluir o paciente{" "}
              <strong>{deletingPatient?.name || "este paciente"}</strong>? Esta ação é permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}