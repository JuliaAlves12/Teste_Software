import { useEffect, useState } from "react";
import { buscarFilmes } from "../../services/api";
import "./movieList.css";
import NavBar from "../../../components/navBar/navBar";
import Card from "../../../components/card/card";
import Footer from "../../../components/footer/Footer";

function extrairNomesCategorias(categorias) {
    if (!categorias) return [];

    let dados = categorias;
    if (typeof dados === "string") {
        try {
            const decodificado = JSON.parse(dados);
            dados = Array.isArray(decodificado) ? decodificado : dados.split(",");
        } catch {
            dados = dados.split(",");
        }
    }

    if (!Array.isArray(dados)) return [];

    return dados
        .map((cat) => {
            if (typeof cat === "string") return cat.trim();
            if (cat && typeof cat === "object") return cat.nome || cat.valor || "";
            return "";
        })
        .filter((nome) => nome && nome.trim() !== "" && nome !== "null");
}

export default function MovieList({ logOut }) {
    const [filmes, setFilmes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [altoContraste, setAltoContraste] = useState(false);
    
    const [busca, setBusca] = useState("");
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [anoSelecionado, setAnoSelecionado] = useState("");
    const [diretorBusca, setDiretorBusca] = useState("");
    const [atorBusca, setAtorBusca] = useState("");

    useEffect(() => {
        async function legendaCarregar() {
            try {
                const dados = await buscarFilmes();
                setFilmes(dados);
            } catch {
                setError("Não foi possível carregar os filmes.");
            } finally {
                setLoading(false);
            }
        }
        legendaCarregar();
    }, []);

    if (loading) {
        return <p className="status">Carregando filmes...</p>;
    }

    if (error) {
        return <p className="status error">{error}</p>;
    }

    const limparFiltros = () => {
        setBusca("");
        setCategoriaSelecionada("");
        setAnoSelecionado("");
        setDiretorBusca("");
        setAtorBusca("");
    };

    const anosDisponiveis = [...new Set(filmes.map(f => f.ano))].sort((a, b) => b - a);

    const filmesFiltrados = filmes.filter((film) => {
        const dadosCompletosString = JSON.stringify(film).toLowerCase();
        
        const bateTexto = film.titulo.toLowerCase().includes(busca.toLowerCase());
        const bateCategoria = !categoriaSelecionada || extrairNomesCategorias(film.categorias).includes(categoriaSelecionada);
        const bateAno = !anoSelecionado || String(film.ano) === anoSelecionado;
        const bateDiretor = !diretorBusca || (film.diretores && dadosCompletosString.includes(diretorBusca.toLowerCase()));
        const bateAtor = !atorBusca || (film.atores && dadosCompletosString.includes(atorBusca.toLowerCase()));
        
        return bateTexto && bateCategoria && bateAno && bateDiretor && bateAtor;
    });

    return (
        <div className={altoContraste ? "pagina-vitrine modo-alto-contraste" : "pagina-vitrine"}>
            <NavBar
                funcaoContraste={() => setAltoContraste(!altoContraste)}
                estaAtivo={altoContraste}
            />

            <section className="filme-section">
                <div className="topo-secao">
                    <h2>Catálogo de Filmes</h2>
                    
                    <div className="area-buscas">
                        <div className="barra-pesquisa-composta">
                            <input 
                                type="text" 
                                className="campo-busca" 
                                placeholder="Buscar filme pelo título..." 
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)} 
                            />

                            <button 
                                className="botao-abrir-filtros" 
                                onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                </svg>
                                Filtros
                            </button>
                        </div>

                        {filtrosAbertos && (
                            <div className="painel-filtros">
                                <div className="grupo-filtro">
                                    <label>Categoria</label>
                                    <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)}>
                                        <option value="">Todas</option>
                                        <option value="Ação">Ação</option>
                                        <option value="Animação">Animação</option>
                                        <option value="Comédia">Comédia</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Ficção Científica">Ficção Científica</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Terror">Terror</option>
                                    </select>
                                </div>

                                <div className="grupo-filtro">
                                    <label>Ano de Lançamento</label>
                                    <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(e.target.value)}>
                                        <option value="">Todos os Anos</option>
                                        {anosDisponiveis.map(ano => (
                                            <option key={ano} value={ano}>{ano}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grupo-filtro">
                                    <label>Diretor</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nome do diretor..." 
                                        value={diretorBusca}
                                        onChange={(e) => setDiretorBusca(e.target.value)}
                                    />
                                </div>

                                <div className="grupo-filtro">
                                    <label>Ator / Atriz</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nome do ator..." 
                                        value={atorBusca}
                                        onChange={(e) => setAtorBusca(e.target.value)}
                                    />
                                </div>

                                <button className="botao-limpar-filtros" onClick={limparFiltros}>
                                    Limpar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="filme-grid">
                    {filmesFiltrados.length > 0 ? (
                        filmesFiltrados.map((film) => {
                            const generos = extrairNomesCategorias(film.categorias);
                            return (
                                <article className="filme-card" key={film.id}>
                                    <img src={film.poster || film.imagem} alt={`Poster do filme ${film.titulo}`} />
                                    <div className="filme-info">
                                        <h3>{film.titulo}</h3>
                                        <p className="card-ano">{film.ano}</p>

                                        {generos.length > 0 && (
                                            <div className="card-generos">
                                                {generos.slice(0, 3).map((g, i) => (
                                                    <span key={i} className="card-genero-tag">{g}</span>
                                                ))}
                                            </div>
                                        )}

                                        {film.sinopse && (
                                            <p className="card-sinopse">{film.sinopse}</p>
                                        )}

                                        <Card idFilme={film.id} />
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--txt-secundario)" }}>
                            Nenhum filme encontrado com esses filtros.
                        </p>
                    )}
                </div>
            </section>

            <Footer logOut={logOut} />
        </div>
    );
}