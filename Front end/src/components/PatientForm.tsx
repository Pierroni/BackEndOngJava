import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface PatientFormProps {
  patient: any | null;
  onSave: (patientData: any) => void;
  onClose: () => void;
}

export function PatientForm({ patient, onSave, onClose }: PatientFormProps) {
  
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    phone: "",
    cep: "",
    address: "",
    observations: "",
    deceased: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carrega dados do paciente quando em modo edição
  useEffect(() => {
    if (patient) {
      // Mapeia os dados do paciente para o formato do formulário
      setFormData({
        name: patient.name || "",
        cpf: patient.cpf || "",
        birthDate: patient.birthDate ? formatDateForInput(patient.birthDate) : "",
        phone: patient.phone || "",
        cep: patient.cep || "",
        address: patient.address || "",
        observations: patient.observations || "",
        deceased: patient.deceased || false,
      });
    } else {
      // Reseta o formulário para novo paciente
      setFormData({
        name: "",
        cpf: "",
        birthDate: "",
        phone: "",
        cep: "",
        address: "",
        observations: "",
        deceased: false,
      });
    }
  }, [patient]);

  // Função para formatar data para input type="date"
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return "";
    }
  };

  // Funções para formatação automática
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        return numbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  function handleChange(field: string, value: any) {
    let formattedValue = value;
    
    // Aplica formatação automática
    if (field === "cpf") {
      formattedValue = formatCPF(value);
    } else if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "cep") {
      formattedValue = formatCEP(value);
    }
    
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";

    // Validação de data (não pode ser data futura)
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = "Data de nascimento não pode ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validate() {
  const newErrors: Record<string, string> = {};

  if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
  if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
  if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória";
  if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
  if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";

  // Validação de CPF (formato e dígitos)
  if (formData.cpf) {
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    
    // Formato básico
    if (cpfLimpo.length !== 11) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    }
    
    // Validação de dígitos (algoritmo básico)
    if (cpfLimpo.length === 11 && !validarCPF(cpfLimpo)) {
      newErrors.cpf = "CPF inválido";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

// Função para validar CPF
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;


    // Mapeia os campos do frontend para os nomes que o backend espera
    onSave({
      nomePas: formData.name,            // Backend espera "nomePas"
      cpf: formData.cpf,
      dataNascimento: formData.birthDate, // Backend espera "dataNascimento"
      telefone: formData.phone,          // Backend espera "telefone"
      cep: formData.cep,
      endereco: formData.address,        // Backend espera "endereco"
      observacoes: formData.observations, // Backend espera "observacoes"
      obito: formData.deceased,          // Backend espera "obito"
    });
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{patient ? "Editar Paciente" : "Novo Paciente"}</DialogTitle>
          <DialogDescription>
            {patient
              ? "Atualize as informações do paciente"
              : "Preencha os dados para cadastrar um novo paciente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
              placeholder="Nome completo do paciente"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label>CPF *</Label>
            <Input
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              placeholder="000.000.000-00"
              className={errors.cpf ? "border-destructive" : ""}
              maxLength={14}
            />
            {errors.cpf && <p className="text-destructive text-sm">{errors.cpf}</p>}
          </div>

          {/* Data de nascimento */}
          <div className="space-y-2">
            <Label>Data de Nascimento *</Label>
            <Input
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              className={errors.birthDate ? "border-destructive" : ""}
            />
            {errors.birthDate && (
              <p className="text-destructive text-sm">{errors.birthDate}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label>Telefone *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(00) 00000-0000"
              className={errors.phone ? "border-destructive" : ""}
              maxLength={15}
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>

          {/* CEP */}
          <div className="space-y-2">
            <Label>CEP *</Label>
            <Input
              value={formData.cep}
              onChange={(e) => handleChange("cep", e.target.value)}
              placeholder="00000-000"
              className={errors.cep ? "border-destructive" : ""}
              maxLength={9}
            />
            {errors.cep && <p className="text-destructive text-sm">{errors.cep}</p>}
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Rua, número, bairro, cidade..."
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <textarea
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Observações sobre o paciente..."
              className="w-full min-h-[100px] p-2 border rounded-md"
            />
          </div>

          {/* Óbito */}
          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div>
              <Label>Óbito</Label>
              <p className="text-sm text-muted-foreground">
                Marque caso o paciente esteja falecido
              </p>
            </div>
            <Switch
              checked={formData.deceased}
              onCheckedChange={(checked) => handleChange("deceased", checked)}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {patient ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}