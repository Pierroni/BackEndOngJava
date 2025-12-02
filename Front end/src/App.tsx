import { useState } from "react";

// Auth screens
import { Login } from "./components/Login";
import { Register } from "./components/Register";

// App layout
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

// App pages
import { Dashboard } from "./components/Dashboard";
import { Patients } from "./components/Patients";
import { PatientDetails } from "./components/PatientDetails";
import { Prontuarios } from "./components/Prontuarios";

// UI
import { Toaster } from "./components/ui/sonner";

// Global CSS
import "./styles/globals.css";

type AuthView = "login" | "register" | "app";
type AppPage = "dashboard" | "patients" | "prontuarios" | "settings";

export default function App() {
  const [authView, setAuthView] = useState<AuthView>("login");
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // LOGIN → entra no app
  const handleLogin = () => {
    setAuthView("app");
    setCurrentPage("dashboard");
  };

  // REGISTER → volta para login
  const handleRegisterSuccess = () => {
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthView("login");
    setCurrentPage("dashboard");
    setSelectedPatientId(null);
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleBackFromPatient = () => {
    setSelectedPatientId(null);
  };

  // 📌 LOGIN PAGE
  if (authView === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  // 📌 REGISTER PAGE
  if (authView === "register") {
    return (
      <Register
        onSwitchToLogin={() => setAuthView("login")}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // 📌 APP PAGE (após login)
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page as AppPage);
          setSelectedPatientId(null);
        }}
        onLogout={handleLogout}
      />

      <div className="ml-64">
        <Topbar />

        <main className="p-6">
          {currentPage === "dashboard" && (
  <Dashboard onNavigate={(page) => setCurrentPage(page as AppPage)} />
)}

          {currentPage === "patients" && !selectedPatientId && (
            <Patients onViewPatient={handleViewPatient} />
          )}

          {currentPage === "patients" && selectedPatientId && (
            <PatientDetails
              patientId={selectedPatientId}
              onBack={handleBackFromPatient}
            />
          )}

          {currentPage === "prontuarios" && <Prontuarios />}

          {currentPage === "settings" && (
            <div className="space-y-6">
              <div>
                <h1>Configurações</h1>
                <p className="text-muted-foreground">
                  Gerencie as configurações do sistema
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border text-center">
                <p className="text-muted-foreground">
                  Configurações em desenvolvimento
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Toaster />
    </div>
  );
}