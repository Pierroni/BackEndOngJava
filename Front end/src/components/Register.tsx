import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Heart } from "lucide-react";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function Register({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [errors, setErrors] = useState({
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { login: "", password: "", confirmPassword: "" };

    if (!login.trim()) {
      newErrors.login = "Login é obrigatório";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login,
          password,
          role,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        alert("Erro: " + msg);
        return;
      }

      alert("Usuário criado com sucesso!");

      // 🔥 AGORA SIM: volta para o Login
      onRegisterSuccess();

    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#38B2AC] to-[#81E6D9] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="size-8 text-white" />
            <h1 className="text-white">Caminhar</h1>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white mb-4">Registrar Usuário</h2>
          <p className="text-white/90 max-w-md">
            Crie um acesso para o sistema de prontuários médicos.
          </p>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-2xl border border-white/30">

          <div className="mb-8">
            <h2 className="mb-2">Criar Conta</h2>
            <p className="text-muted-foreground">
              Preencha os dados para registrar um novo usuário
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">

            {/* LOGIN */}
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Nome de acesso"
                className={`bg-white/50 ${errors.login ? "border-destructive" : ""}`}
              />
              {errors.login && <p className="text-destructive text-sm">{errors.login}</p>}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`bg-white/50 pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                className={`bg-white/50 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* ROLE */}
            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 rounded-md border bg-white/50"
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Registrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já possui conta?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
