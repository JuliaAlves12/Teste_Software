import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../../components/navBar/navBar";
import Footer from "../../../components/footer/Footer";
import { buscarDadosAuxiliares, adicionarFilme } from "../../services/api";
import "./AddMovie.css";

export default function AddMovie({ logOut }) {
    const navigate = useNavigate();
    const [altoContraste, setAltoContraste] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    const [dbListas, setDbListas] = useState({
        categorias: [], produtoras: [], diretores: [], atores: [], linguagens: [], paises: []
    });

    const [titulo, setTitulo] = useState("");
    const [ano, setAno] = useState("");
    const [sinopse, setSinopse] = useState("");
    const [duracao, setDuracao] = useState("");
    const [imagem, setImagem] = useState("");
    const [orcamento, setOrcamento] = useState("");

    const [selecionados, setSelecionados] = useState({
        categorias: [], produtoras: [], diretores: [], atores: [], linguagens: [], paises: []
    });

    const [novos, setNovos] = useState({
        categorias: "", produtoras: "", diretores: "", atores: "", linguagens: "", paises: ""
    });

    useEffect(() => {
        const carregarListas = async () => {
            const endpoints = ["categorias", "produtoras", "diretores", "atores", "linguagens", "paises"];
            const novasListas = {};

            for (let ep of endpoints) {
                novasListas[ep] = await buscarDadosAuxiliares(ep);
            }
            setDbListas(novasListas);
        };
        carregarListas();
    }, []);

    const handleSelectChange = (e, campo) => {
        const valores = Array.from(e.target.selectedOptions, option => option.value);
        setSelecionados({ ...selecionados, [campo]: valores });
    };

    const handleNovosChange = (e, campo) => {
        setNovos({ ...novos, [campo]: e.target.value });
    };

    const transformarEmArray = (texto) => {
        if (!texto) return [];
        return texto.split(",").map((item) => item.trim()).filter((item) => item !== "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem({ texto: "", tipo: "" });

        const token = localStorage.getItem("access_token");

        const juntarDados = (campo) => {
            const arrayDigitados = transformarEmArray(novos[campo]);
            return [...selecionados[campo], ...arrayDigitados];
        };

        const filmeDados = {
            titulo,
            ano: parseInt(ano) || 2026,
            sinopse,
            duracao,
            imagem,
            orcamento: orcamento || "0",
            categorias: juntarDados("categorias"),
            produtoras: juntarDados("produtoras"),
            diretores: juntarDados("diretores"),
            atores: juntarDados("atores"),
            linguagens: juntarDados("linguagens"),
            paises: juntarDados("paises")
        };

        try {
            const dados = await adicionarFilme(filmeDados, token);

            setMensagem({ texto: dados.message || "Sucesso!", tipo: "sucesso" });

            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMensagem({ texto: error.message, tipo: "erro" });
        } finally {
            setLoading(false);
        }
    };

    const formatarNomeCompleto = (item) => {
        if (item.sobrenome) return `${item.nome} ${item.sobrenome}`.trim();
        return item.nome.trim();
    };

    return (
        <div className={altoContraste ? "pagina-add-movie modo-alto-contraste" : "pagina-add-movie"}>
            <NavBar
                funcaoContraste={() => setAltoContraste(!altoContraste)}
                estaAtivo={altoContraste}
            />

            <main className="form-container">
                <div className="topo-form">
                    <h2>Adicionar Novo Filme</h2>
                    <p>Preencha os dados básicos e selecione/adicione as características ao lado.</p>
                </div>

                {mensagem.texto && (
                    <div className={`alerta-form alert-${mensagem.tipo}`}>{mensagem.texto}</div>
                )}

                <form onSubmit={handleSubmit} className="formulario-layout-duplo">
                    <div className="coluna-esquerda">
                        <h3>Informações Principais</h3>
                        <div className="grupo-input">
                            <label>Título do Filme *</label>
                            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        </div>
                        
                        <div className="grupo-form-linha">
                            <div className="grupo-input">
                                <label>Ano *</label>
                                <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} required />
                            </div>
                            <div className="grupo-input">
                                <label>Duração (HH:MM:SS) *</label>
                                <input type="text" value={duracao} onChange={(e) => setDuracao(e.target.value)} required placeholder="Ex: 02:00:00" />
                            </div>
                        </div>

                        <div className="grupo-input">
                            <label>Orçamento (Opcional)</label>
                            <input type="text" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} placeholder="Ex: 150000000" />
                        </div>

                        <div className="grupo-input">
                            <label>URL do Poster *</label>
                            <input type="url" value={imagem} onChange={(e) => setImagem(e.target.value)} required />
                        </div>

                        <div className="grupo-input">
                            <label>Sinopse *</label>
                            <textarea value={sinopse} onChange={(e) => setSinopse(e.target.value)} required rows="6"></textarea>
                        </div>
                    </div>

                    <div className="coluna-direita">
                        <h3>Ficha Técnica</h3>
                        <p className="aviso-ctrl">Segure <strong>CTRL</strong> para selecionar vários. Ou digite nomes novos abaixo de cada lista!</p>
                        
                        <div className="grid-selecao">
                            <div className="grupo-hibrido">
                                <label>Categorias</label>
                                <select multiple value={selecionados.categorias} onChange={(e) => handleSelectChange(e, "categorias")}>
                                    {dbListas.categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                                </select>
                                <input type="text" placeholder="Ou digite nova..." value={novos.categorias} onChange={(e) => handleNovosChange(e, "categorias")} />
                            </div>

                            <div className="grupo-hibrido">
                                <label>Diretores</label>
                                <select multiple value={selecionados.diretores} onChange={(e) => handleSelectChange(e, "diretores")}>
                                    {dbListas.diretores.map(d => {
                                        const nomeFull = formatarNomeCompleto(d);
                                        return <option key={d.id} value={nomeFull}>{nomeFull}</option>
                                    })}
                                </select>
                                <input type="text" placeholder="Ou digite novo..." value={novos.diretores} onChange={(e) => handleNovosChange(e, "diretores")} />
                            </div>

                            <div className="grupo-hibrido">
                                <label>Atores Principais</label>
                                <select multiple value={selecionados.atores} onChange={(e) => handleSelectChange(e, "atores")}>
                                    {dbListas.atores.map(a => {
                                        const nomeFull = formatarNomeCompleto(a);
                                        return <option key={a.id} value={nomeFull}>{nomeFull}</option>
                                    })}
                                </select>
                                <input type="text" placeholder="Ou digite novo..." value={novos.atores} onChange={(e) => handleNovosChange(e, "atores")} />
                            </div>

                            <div className="grupo-hibrido">
                                <label>Linguagens</label>
                                <select multiple value={selecionados.linguagens} onChange={(e) => handleSelectChange(e, "linguagens")}>
                                    {dbListas.linguagens.map(l => <option key={l.id} value={l.nome}>{l.nome}</option>)}
                                </select>
                                <input type="text" placeholder="Ou digite nova..." value={novos.linguagens} onChange={(e) => handleNovosChange(e, "linguagens")} />
                            </div>

                            <div className="grupo-hibrido">
                                <label>Países</label>
                                <select multiple value={selecionados.paises} onChange={(e) => handleSelectChange(e, "paises")}>
                                    {dbListas.paises.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                                </select>
                                <input type="text" placeholder="Ou digite novo..." value={novos.paises} onChange={(e) => handleNovosChange(e, "paises")} />
                            </div>

                            <div className="grupo-hibrido">
                                <label>Produtoras</label>
                                <select multiple value={selecionados.produtoras} onChange={(e) => handleSelectChange(e, "produtoras")}>
                                    {dbListas.produtoras.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                                </select>
                                <input type="text" placeholder="Ou digite nova..." value={novos.produtoras} onChange={(e) => handleNovosChange(e, "produtoras")} />
                            </div>
                        </div>
                    </div>

                    <div className="area-botao">
                        <button type="submit" className="botao-submit-filme" disabled={loading}>
                            {loading ? "Cadastrando..." : "Cadastrar Filme"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer logOut={logOut} />
        </div>
    );
}