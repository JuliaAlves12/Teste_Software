import { Link } from "react-router-dom";
import "./navBar.css";

export default function NavBar({ funcaoContraste, estaAtivo }) {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    const eAdmin = userRole && userRole.toLowerCase() === "admin";

    return (
        <header className="header-nav">
            <div className="left-navbar">
                <Link to="/">
                    <h1>Cinelist</h1>
                </Link>
                <p className="frase">Seu catálogo de filmes favoritos.</p>
            </div>

            <div className="right-navbar">
                <button className="botao-contraste" onClick={funcaoContraste}>
                    {estaAtivo ? "Modo Padrão" : "Alto Contraste"}
                </button>

                {token && (
                    <>
                        <Link to="/add-movie" className="botao-adicionar">
                            Adicionar Filme
                        </Link>

                        <Link 
                            to="/perfil" 
                            className={`botao-perfil ${eAdmin ? "perfil-admin" : "perfil-user"}`} 
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            {eAdmin ? "Admin" : "Cinéfilo"}
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}