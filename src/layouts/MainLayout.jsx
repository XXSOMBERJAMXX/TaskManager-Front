import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPage from "../views/Dashboard/DashboardPage";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Obtén el token del localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Si no hay token, redirige al login
      navigate("/login");
    } else {
      // Aquí puedes verificar la validez del token si es necesario
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      const expirationTime = decodedToken.exp * 1000; // Convertir el tiempo de expiración a milisegundos
      if (Date.now() > expirationTime) {
        // Si el token ha expirado, redirige al login
        navigate("/login");
      }
    }
  }, [navigate]);

  

  return (
    <div className="flex h-screen w-full bg-gradient-to-r from-blue-500 to-indigo-600">
      {/* Botón para abrir/cerrar la barra lateral en móviles */}
      <button
        className="md:hidden fixed top-4 left-4 p-2 bg-white rounded-lg z-50"
        onClick={toggleSidebar}
      >
        {/* Icono de menú (puedes usar un ícono de tu elección) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Barra lateral */}
      <div
        className={`fixed md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out w-64 h-full bg-gradient-to-r from-blue-500  md:bg-transparent z-40`}
      >
        <div className="h-full py-6 px-4">
          <Sidebar />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 h-screen w-full overflow-auto p-6">
        <DashboardPage />
      </div>
    </div>

  );
}
