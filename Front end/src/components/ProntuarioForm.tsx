import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Search, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ProntuarioFormData {
  id?: number;
  consulta: string;
  sintomas: string;
  diagnostico: string;
  exames: string;
  dataRegistro: string;
  pacienteId?: number;
  pacienteNome?: string;
}

interface ProntuarioFormProps {
  prontuario: Partial<ProntuarioFormData> | null;
  onSave: (prontuario: Partial<ProntuarioFormData>) => void;
  onClose: () => void;
}

export function ProntuarioForm({
  prontuario,
  onSave,
  onClose,
}: ProntuarioFormProps) {
  const [formData, setFormData] = useState<Partial<ProntuarioFormData>>({
    consulta: "",
    sintomas: "",
    diagnostico: "",
    exames: "",
    dataRegistro: new Date().toISOString().split("T")[0],
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar pacientes
  useEffect(() => {
    async function loadPatients() {
      try {
        setLoadingPatients(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:8080/pacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const validPatients = Array.isArray(data)
            ? data
                .filter((p) => p.id && p.id.toString().trim() !== "")
                .map((p) => ({
                  id: p.id,
                  nome: p.nome || p.nomePas || p.name || `Paciente ${p.id}`,
                  cpf: p.cpf || "",
                  email: p.email || "",
                }))
            : [];
          setPatients(validPatients);
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      } finally {
        setLoadingPatients(false);
      }
    }
    loadPatients();
  }, []);

  // Inicializar formData
  useEffect(() => {
    if (prontuario) {
      setFormData(prontuario);
    }
  }, [prontuario]);

  const handleChange = (field: keyof ProntuarioFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.consulta?.trim())
      newErrors.consulta = "Tipo de consulta é obrigatório";
    if (!formData.dataRegistro) newErrors.dataRegistro = "Data é obrigatória";
    if (!formData.sintomas?.trim())
      newErrors.sintomas = "Sintomas são obrigatórios";
    if (!formData.diagnostico?.trim())
      newErrors.diagnostico = "Diagnóstico é obrigatório";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  // Componente interno de busca de pacientes
  function PatientSearchSelect({
    patients,
    value,
    onChange,
  }: {
    patients: any[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
  }) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredPatients, setFilteredPatients] = useState<any[]>([]);

    useEffect(() => {
      if (search.trim() === "") {
        setFilteredPatients(patients.slice(0, 10)); // Mostra apenas os primeiros 10
      } else {
        const query = search.toLowerCase();
        const filtered = patients.filter(
          (p) =>
            p.nome.toLowerCase().includes(query) ||
            (p.cpf && p.cpf.toLowerCase().includes(query)) ||
            (p.email && p.email.toLowerCase().includes(query))
        );
        setFilteredPatients(filtered.slice(0, 20)); // Limita resultados
      }
    }, [search, patients]);

    const selectedPatient = patients.find((p) => p.id === value);

    return (
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedPatient ? selectedPatient.nome : "Selecione um paciente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar paciente por nome, CPF ou email..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b"
                onClick={() => {
                  onChange(undefined);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                Nenhum paciente específico
              </div>

              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => {
                    onChange(patient.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="font-medium">{patient.nome}</div>
                  {(patient.cpf || patient.email) && (
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {patient.cpf && <span>CPF: {patient.cpf}</span>}
                      {patient.email && <span>Email: {patient.email}</span>}
                    </div>
                  )}
                </div>
              ))}

              {filteredPatients.length === 0 && (
                <div className="px-3 py-4 text-muted-foreground text-center text-sm">
                  Nenhum paciente encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {prontuario?.id ? "Editar Registro" : "Novo Registro de Consulta"}
          </DialogTitle>
          <DialogDescription>
            {prontuario?.id
              ? "Atualize os detalhes do registro de consulta"
              : "Crie um novo registro de consulta médica"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Consulta */}
          <div className="space-y-2">
            <Label htmlFor="consulta">Tipo de Consulta *</Label>
            <Input
              id="consulta"
              placeholder="Ex: Consulta Neurológica"
              value={formData.consulta || ""}
              onChange={(e) => handleChange("consulta", e.target.value)}
              className={errors.consulta ? "border-destructive" : ""}
            />
            {errors.consulta && (
              <p className="text-destructive text-sm">{errors.consulta}</p>
            )}
          </div>

          {/* Paciente com pesquisa simplificada */}
          {!loadingPatients && patients.length > 0 && (
            <div className="space-y-2">
              <Label>Paciente (opcional)</Label>
              <PatientSearchSelect
                patients={patients}
                value={formData.pacienteId}
                onChange={(value) => handleChange("pacienteId", value)}
              />
              {formData.pacienteId && (
                <div className="text-sm text-muted-foreground">
                  Paciente selecionado:{" "}
                  <span className="font-medium">
                    {patients.find((p) => p.id === formData.pacienteId)?.nome}
                  </span>
                </div>
              )}
            </div>
          )}

          {loadingPatients && (
            <div className="text-sm text-muted-foreground">
              Carregando pacientes...
            </div>
          )}

          {!loadingPatients && patients.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Nenhum paciente cadastrado
            </div>
          )}

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="dataRegistro">Data da Consulta *</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="dataRegistro"
                type="date"
                value={formData.dataRegistro || ""}
                onChange={(e) => handleChange("dataRegistro", e.target.value)}
                className={`pl-10 ${
                  errors.dataRegistro ? "border-destructive" : ""
                }`}
              />
            </div>
            {errors.dataRegistro && (
              <p className="text-destructive text-sm">{errors.dataRegistro}</p>
            )}
          </div>

          {/* Sintomas */}
          <div className="space-y-2">
            <Label htmlFor="sintomas">Sintomas *</Label>
            <Textarea
              id="sintomas"
              rows={3}
              placeholder="Descreva os sintomas apresentados..."
              value={formData.sintomas || ""}
              onChange={(e) => handleChange("sintomas", e.target.value)}
              className={errors.sintomas ? "border-destructive" : ""}
            />
            {errors.sintomas && (
              <p className="text-destructive text-sm">{errors.sintomas}</p>
            )}
          </div>

          {/* Diagnóstico */}
          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnóstico *</Label>
            <Textarea
              id="diagnostico"
              rows={3}
              placeholder="Descreva o diagnóstico..."
              value={formData.diagnostico || ""}
              onChange={(e) => handleChange("diagnostico", e.target.value)}
              className={errors.diagnostico ? "border-destructive" : ""}
            />
            {errors.diagnostico && (
              <p className="text-destructive text-sm">{errors.diagnostico}</p>
            )}
          </div>

          {/* Exames */}
          <div className="space-y-2">
            <Label htmlFor="exames">Exames Realizados/Solicitados</Label>
            <Textarea
              id="exames"
              rows={2}
              placeholder="Liste os exames, separados por vírgula"
              value={formData.exames || ""}
              onChange={(e) => handleChange("exames", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {prontuario?.id ? "Atualizar Registro" : "Criar Registro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
