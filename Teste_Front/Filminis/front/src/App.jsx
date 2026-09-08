import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import MovieList from "./pages/MovieList/MovieList"; 
import Movie from "./pages/Movie/Movie";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AddMovie from "./pages/AdicionarMovie/AddMovie"; 
import EditarFilme from "./pages/EditarFilme/EditarFilme"; 
import AdminPainel from "./pages/AdminPainel/AdminPainel"; 
import Perfil from "./pages/Perfil/Perfil"; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("user_role")); 

  const logOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setToken(null);
    setUserRole(null);
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieList logOut={logOut} />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/login" element={<Login setToken={setToken} setRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/add-movie" 
          element={token ? <AddMovie logOut={logOut} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/edit-movie" 
          element={token ? <EditarFilme logOut={logOut} /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/perfil" 
          element={token ? <Perfil logOut={logOut} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/admin" 
          element={
            token && userRole === "admin" ? (
              <AdminPainel logOut={logOut} />
            ) : (
              <Navigate to="/" /> 
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}