import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Heart } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ login: "", password: "" });

  // -------------------------------------------------------
  // 🔵 FUNÇÃO DE LOGIN
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { login: "", password: "" };

    if (!login) {
      newErrors.login = "Login é obrigatório";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });

      if (!response.ok) {
        alert("Usuário ou senha incorretos");
        return;
      }

      const data = await response.json();

      // Salva token
      localStorage.setItem("token", data.token);

      // Muda tela
      onLogin();

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor");
    }
  };

  // -------------------------------------------------------
  // 🔵 FUNÇÃO DE REGISTRO (NOVO)
  // -------------------------------------------------------
  const handleRegister = async () => {
    if (!login || !password) {
      alert("Preencha login e senha");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: password,
          role: "USER"
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        alert("Erro ao registrar: " + msg);
        return;
      }

      alert("Registrado com sucesso!");
      onSwitchToRegister(); // volta para tela de login

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Section - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#38B2AC] to-[#81E6D9] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Heart className="size-8 text-white" />
            <h1 className="text-white">Caminhar</h1>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-white mb-4">Sistema de Prontuários Confiável</h2>
          <p className="text-white/90 max-w-md">
            Gerencie pacientes, prontuários e atendimentos de forma moderna, 
            segura e eficiente. Tenha todos os dados médicos organizados em um só lugar.
          </p>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20">
            <Heart className="size-32 text-white" />
          </div>
          <div className="absolute bottom-32 left-20">
            <Heart className="size-24 text-white" />
          </div>
        </div>
      </div>

      {/* Login Form - Right Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          className="w-full max-w-md backdrop-blur-sm bg-white/70 p-8 rounded-2xl shadow-2xl border border-white/30"
        >
          <div className="mb-8">
            <h2 className="mb-2">Bem-vindo</h2>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="Seu login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={`bg-white/50 ${errors.login ? 'border-destructive' : ''}`}
              />
              {errors.login && (
                <p className="text-destructive text-sm">{errors.login}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-white/50 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <button type="button" className="text-primary hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
  <p className="text-muted-foreground">
    Não tem uma conta?{" "}
    
    {/* IMPORTANTE: type="button" impede o submit do form */}
    <button
      type="button"
      onClick={onSwitchToRegister}
      className="text-primary hover:underline"
    >
      Registre-se
    </button>
  </p>
</div>
        </div>
      </div>
    </div>
  );
}
