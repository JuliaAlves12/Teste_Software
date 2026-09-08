import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../components/navBar/navBar";
import Footer from "../../../components/footer/Footer";
import { buscarPerfil, atualizarFotoPerfil } from "../../services/api";
import "./Perfil.css";

export default function Perfil({ logOut }) {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [altoContraste, setAltoContraste] = useState(false);
    const [favoritos, setFavoritos] = useState([]);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem("access_token");

    const carregarDadosPerfil = async () => {
        try {
            const dados = await buscarPerfil(token);
            setPerfil(dados);
        } catch {
            setErro("Não foi possível carregar os dados do perfil.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            carregarDadosPerfil();

            const favsSalvos = JSON.parse(localStorage.getItem("favoritos_cinelist")) || [];
            setFavoritos(favsSalvos);
        } else {
            setErro("Sua sessão expirou. Faça login novamente.");
            setLoading(false);
        }
    }, [token]);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            setErro("");
            setMensagemSucesso("");

            try {
                await atualizarFotoPerfil(base64String, token);
                setMensagemSucesso("Foto de perfil atualizada com sucesso!");
                carregarDadosPerfil();
            } catch (error) {
                setErro(error.message || "Erro ao atualizar a foto.");
            }
        };
        reader.readAsDataURL(arquivo);
    };

    return (
        <div className={altoContraste ? "pagina-perfil modo-alto-contraste" : "pagina-perfil"}>
            <NavBar
                funcaoContraste={() => setAltoContraste(!altoContraste)}
                estaAtivo={altoContraste}
            />

            <main className="perfil-container">
                {loading ? (
                    <p className="status">Carregando perfil...</p>
                ) : erro ? (
                    <p className="status error">{erro}</p>
                ) : perfil ? (
                    <div className="perfil-conteudo-wrapper">
                        <div className="perfil-card">
                            <div className="perfil-imagem-wrapper">
                                <div className="avatar-container" onClick={handleAvatarClick} title="Clique para alterar a foto">
                                    <img 
                                        src={perfil.imagem || "https://via.placeholder.com/180"} 
                                        alt="Avatar do usuário" 
                                        className="perfil-avatar" 
                                    />
                                    <div className="overlay-upload">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                    </div>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />

                                <div className={`tag-role ${perfil.role === "admin" ? "tag-admin" : "tag-user"}`}>
                                    {perfil.role === "admin" ? "Administrador" : "Cinéfilo"}
                                </div>
                            </div>

                            <div className="perfil-info">
                                <h2>{perfil.nome} {perfil.sobrenome}</h2>
                                
                                {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}

                                <div className="info-linha">
                                    <span>Apelido</span>
                                    <p>{perfil.apelido || "Não informado"}</p>
                                </div>

                                <div className="info-linha">
                                    <span>E-mail</span>
                                    <p>{perfil.email}</p>
                                </div>

                                <div className="info-linha">
                                    <span>Data de Nascimento</span>
                                    <p>
                                        {perfil.data_nascimento 
                                            ? new Date(perfil.data_nascimento).toLocaleDateString('pt-BR') 
                                            : "Não informada"}
                                    </p>
                                </div>

                                {perfil.role === "admin" && (
                                    <div className="area-botao-admin">
                                        <Link to="/admin" className="botao-ir-admin">
                                            Acessar Painel de Moderação
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="secao-favoritos">
                            <h3>Meus Filmes Favoritos</h3>
                            {favoritos.length > 0 ? (
                                <div className="grade-favoritos">
                                    {favoritos.map((fav) => (
                                        <Link to={`/movie?id=${fav.id}`} key={fav.id} className="card-favorito">
                                            <img src={fav.poster} alt={`Poster do filme ${fav.titulo}`} />
                                            <div className="info-card-fav">
                                                <h4>{fav.titulo}</h4>
                                                <span>{fav.ano}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="texto-vazio">Você ainda não favoritou nenhum filme. Vá até o catálogo e comece a curtir!</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </main>

            <Footer logOut={logOut} />
        </div>
    );
}