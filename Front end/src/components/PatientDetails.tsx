import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Calendar, FileText, User, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { NovoAtendimento } from "./NovoAtendimento";

interface PatientDetailsProps {
  patientId: string;
  onBack: () => void;
}

export function PatientDetails({ patientId, onBack }: PatientDetailsProps) {
  const [showNovoAtendimento, setShowNovoAtendimento] = useState(false);
  const [patient, setPatient] = useState<any | null>(null);
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // ============================
  // 1. Buscar paciente real
  // ============================
  async function loadPatient() {
    try {
      const response = await fetch(`http://localhost:8080/pacientes/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Erro ao buscar paciente");
        return;
      }

      const data = await response.json();

      setPatient({
        id: data.id,
        name: data.nomePas,
        cpf: data.cpf,
        birthDate: data.dataNascimento,
        phone: data.telefone,
        cep: data.cep,
        address: data.endereco,
        observations: data.observacoes,
        deceased: data.obito,
      });
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  // ==============================
  // 2. Buscar atendimentos reais
  // ==============================
  async function loadProntuarios() {
    try {
      const response = await fetch(
        `http://localhost:8080/prontuarios/paciente/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Erro ao buscar prontuários");
        return;
      }

      const data = await response.json();
      setProntuarios(data);
    } catch (err) {
      console.error("Erro:", err);
    }
  }

  useEffect(() => {
    loadPatient();
    loadProntuarios();
  }, [patientId]);

  if (!patient) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Carregando dados...
      </div>
    );
  }

  // Função para calcular idade
  function calcAge(date: string) {
    const birth = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1>Detalhes do Paciente</h1>
            <p className="text-muted-foreground">Informações completas e histórico</p>
          </div>
        </div>

        <Button onClick={() => setShowNovoAtendimento(true)}>
          <Plus className="size-4 mr-2" /> Novo Atendimento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Paciente</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center pb-4 border-b">
              <Avatar className="size-20 mb-3">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {patient.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3>{patient.name}</h3>
              <p className="text-muted-foreground">{calcAge(patient.birthDate)} anos</p>

              <Badge
                variant={patient.deceased ? "destructive" : "default"}
                className="mt-2"
              >
                {patient.deceased ? "Óbito" : "Ativo"}
              </Badge>
            </div>

            {/* Dados */}
            <div className="space-y-3">
              <Info icon={<User />} label="CPF" value={patient.cpf} />
              <Info
                icon={<Calendar />}
                label="Nascimento"
                value={new Date(patient.birthDate).toLocaleDateString("pt-BR")}
              />
              <Info icon={<Phone />} label="Telefone" value={patient.phone} />
              <Info
                icon={<MapPin />}
                label="Endereço"
                value={`${patient.address} (CEP: ${patient.cep})`}
              />

              {patient.observations && (
                <Info
                  icon={<FileText />}
                  label="Observações"
                  value={patient.observations}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Atendimentos</CardTitle>
          </CardHeader>

          <CardContent>
            {prontuarios.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="size-12 mx-auto mb-2 opacity-50" />
                Nenhum atendimento registrado
              </div>
            ) : (
              <div className="space-y-4">
                {prontuarios.map((p, index) => (
                  <div key={p.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="size-5 text-primary" />
                      </div>
                      {index < prontuarios.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="font-medium">{p.profissional}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(p.data).toLocaleDateString("pt-BR")} às {p.hora}
                          </p>
                        </div>
                        <Badge variant="outline">{p.status}</Badge>
                      </div>

                      <div className="space-y-2 bg-accent/40 p-4 rounded-lg">
                        <p><b>Sintomas:</b> {p.sintomas}</p>
                        <p><b>Diagnóstico:</b> {p.diagnostico}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Novo Atendimento */}
      {showNovoAtendimento && (
        <NovoAtendimento
          patientId={patientId}
          patientName={patient.name}
          onClose={() => setShowNovoAtendimento(false)}
          onSave={() => {
            loadProntuarios();
            setShowNovoAtendimento(false);
          }}
        />
      )}
    </div>
  );
}

// Componente para exibir linha de informação
function Info({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
