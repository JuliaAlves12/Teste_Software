import { useEffect, useState } from "react";
import { buscarFilmes, deletarFilme } from "../../services/api";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar/navBar";
import "./Movie.css";

export default function Movie() {
    const [buscaParam] = useSearchParams();
    const id = buscaParam.get('id');
    const navigate = useNavigate();

    const [filme, setFilme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [altoContraste, setAltoContraste] = useState(false);
    const [isFavorito, setIsFavorito] = useState(false);

    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    const eAdmin = userRole && userRole.toLowerCase() === "admin";

    useEffect(() => {
        async function carregarFilme() {
            try {
                setLoading(true);
                setErro("");

                const todosOsFilmes = await buscarFilmes();
                
                const filmeEncontrado = todosOsFilmes.find((f) => String(f.id) === String(id));

                if (!filmeEncontrado) {
                    throw new Error("Filme não encontrado na lista.");
                }

                setFilme(filmeEncontrado); 
                
                const favsSalvos = JSON.parse(localStorage.getItem("favoritos_cinelist")) || [];
                const jaFavoritado = favsSalvos.some(f => String(f.id) === String(id));
                setIsFavorito(jaFavoritado);

            } catch (erro) {
                setErro(erro.message);
            } finally {
                setLoading(false);
            }
        }
        
        if (id) {
            carregarFilme();
        }
    }, [id]);

    const handleDeletar = async () => {
        const confirmar = window.confirm("Atenção! Você tem certeza que deseja deletar este filme permanentemente do catálogo?");
        if (!confirmar) return;

        try {
            await deletarFilme(id, token);
            alert("Filme removido com sucesso!");
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    const toggleFavorito = () => {
        let favsSalvos = JSON.parse(localStorage.getItem("favoritos_cinelist")) || [];
        const index = favsSalvos.findIndex(f => String(f.id) === String(id));

        if (index >= 0) {
            favsSalvos.splice(index, 1);
            setIsFavorito(false);
        } else {
            favsSalvos.push({
                id: filme.id,
                titulo: filme.titulo,
                poster: filme.poster || filme.imagem,
                ano: filme.ano
            });
            setIsFavorito(true);
        }
        localStorage.setItem("favoritos_cinelist", JSON.stringify(favsSalvos));
    };

    if (loading) {
        return <p className="status">Carregando filme...</p>;
    }

    if (erro) {
        return <p className="status error">Erro: {erro}</p>;
    }

    if (!filme) {
        return <p className="status error">Nenhum filme para exibir.</p>;
    }

    let listaCategorias = [];
    if (filme.categorias) {
        let dadosBrutos = filme.categorias;
        
        if (typeof dadosBrutos === 'string') {
            try {
                const decodificado = JSON.parse(dadosBrutos);
                dadosBrutos = Array.isArray(decodificado) ? decodificado : dadosBrutos.split(',');
            } catch {
                dadosBrutos = dadosBrutos.split(',');
            }
        }
        
        if (Array.isArray(dadosBrutos)) {
            listaCategorias = dadosBrutos
                .map(cat => {
                    if (typeof cat === 'string') {
                        if (cat.startsWith('{') && cat.endsWith('}')) {
                            try {
                                const parsed = JSON.parse(cat);
                                return parsed.nome || parsed.valor || '';
                            } catch {
                                return cat.trim();
                            }
                        }
                        return cat.trim();
                    }
                    if (typeof cat === 'object' && cat !== null) {
                        return cat.nome || cat.valor || '';
                    }
                    return '';
                })
                .filter(cat => cat && cat.trim() !== '' && cat !== 'null');
        }
    }

    return (
        <div className={altoContraste ? "pagina-detalhes modo-alto-contraste" : "pagina-detalhes"}>
            <NavBar 
                funcaoContraste={() => setAltoContraste(!altoContraste)} 
                estaAtivo={altoContraste} 
            />

            <main className="detalhes-container">
                <Link to="/" className="botao-voltar">← Voltar para o Catálogo</Link>

                <section className="detalhes-conteudo">
                    <img 
                        src={filme.poster || filme.imagem} 
                        alt={`Poster do filme ${filme.titulo}`} 
                        className="detalhes-poster" 
                    />

                    <div className="detalhes-info">
                        <h1>{filme.titulo}</h1>

                        <div className="tags-filme">
                            <span className="tag-info">{filme.ano}</span>
                            <span className="tag-info">{filme.duracao}</span>
                        </div>

                        <div className="categorias-box">
                            <h3>Categorias</h3>
                            <ul className="lista-categorias">
                                {listaCategorias.length > 0 ? (
                                    listaCategorias.map((categoria, index) => (
                                        <li key={index} className="tag-categoria">
                                            {categoria}
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ fontSize: "14px", color: "var(--txt-secundario)", margin: 0 }}>Nenhuma categoria informada.</p>
                                )}
                            </ul>
                        </div>

                        <div className="sinopse-box">
                            <h3>Sinopse</h3>
                            <p>{filme.sinopse}</p>
                        </div>

                        {token && (
                            <div className="area-acoes-filme">
                                <button className={`botao-favoritar ${isFavorito ? 'ativo' : ''}`} onClick={toggleFavorito}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorito ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    {isFavorito ? "Favoritado" : "Favoritar"}
                                </button>

                                <Link to={`/edit-movie?id=${id}`} className="botao-editar-filme">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    {eAdmin ? "Editar Filme" : "Pedir Edição"}
                                </Link>

                                {eAdmin && (
                                    <>
                                        <button className="botao-deletar-filme" onClick={handleDeletar}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}>
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                            Deletar
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}