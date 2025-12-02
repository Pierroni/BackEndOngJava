import { useState } from "react";
import { X, Upload, Calendar as CalendarIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

interface NovoAtendimentoProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSave: () => void;
}

export function NovoAtendimento({
  patientId,
  patientName,
  onClose,
  onSave,
}: NovoAtendimentoProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    status: "realizado",
    symptoms: "",
    diagnosis: "",
    exams: [] as string[],
    notes: "",
  });

  const [newExam, setNewExam] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addExam = () => {
    if (newExam.trim() && !formData.exams.includes(newExam.trim())) {
      handleChange("exams", [...formData.exams, newExam.trim()]);
      setNewExam("");
    }
  };

  const removeExam = (exam: string) => {
    handleChange(
      "exams",
      formData.exams.filter((e) => e !== exam)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Data é obrigatória";
    if (!formData.time) newErrors.time = "Hora é obrigatória";
    if (!formData.symptoms) newErrors.symptoms = "Sintomas são obrigatórios";
    if (!formData.diagnosis) newErrors.diagnosis = "Diagnóstico é obrigatório";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success("Atendimento registrado com sucesso!");
      onSave();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Atendimento - {patientName}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para registrar um novo atendimento para o
            paciente {patientName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className={`pl-10 ${errors.date ? "border-destructive" : ""}`}
                />
              </div>
              {errors.date && (
                <p className="text-destructive text-sm">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={errors.time ? "border-destructive" : ""}
              />
              {errors.time && (
                <p className="text-destructive text-sm">{errors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status do Atendimento</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">Sintomas *</Label>
            <Textarea
              id="symptoms"
              rows={4}
              placeholder="Descreva os sintomas apresentados pelo paciente..."
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              className={errors.symptoms ? "border-destructive" : ""}
            />
            {errors.symptoms && (
              <p className="text-destructive text-sm">{errors.symptoms}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Você pode usar bullets (•) para listar sintomas
            </p>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea
              id="diagnosis"
              rows={4}
              placeholder="Descreva o diagnóstico e observações..."
              value={formData.diagnosis}
              onChange={(e) => handleChange("diagnosis", e.target.value)}
              className={errors.diagnosis ? "border-destructive" : ""}
            />
            {errors.diagnosis && (
              <p className="text-destructive text-sm">{errors.diagnosis}</p>
            )}
          </div>

          {/* Exams */}
          <div className="space-y-2">
            <Label htmlFor="exams">Exames Solicitados</Label>
            <div className="flex gap-2">
              <Input
                id="exams"
                value={newExam}
                onChange={(e) => setNewExam(e.target.value)}
                placeholder="Digite o nome do exame"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addExam();
                  }
                }}
              />
              <Button type="button" onClick={addExam}>
                Adicionar
              </Button>
            </div>
            {formData.exams.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.exams.map((exam, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {exam}
                    <button
                      type="button"
                      onClick={() => removeExam(exam)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações Adicionais (opcional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Observações, recomendações, prescrições..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Anexar Documentos (opcional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique ou arraste para fazer upload de exames, PDFs ou imagens
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Atendimento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}