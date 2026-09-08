import { useState, useEffect } from "react";
import NavBar from "../../../components/navBar/navBar";
import Footer from "../../../components/footer/Footer";
import { buscarFilmesPendentes, aprovarFilme, deletarFilme, editarFilme, buscarDadosAuxiliares } from "../../services/api";
import { listarSolicitacoes, removerSolicitacao } from "../../services/solicitacoesEdicao";
import "./AdminPainel.css";

export default function AdminPainel({ logOut }) {
    const [filmesPendentes, setFilmesPendentes] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [dbListas, setDbListas] = useState({
        categorias: [], produtoras: [], diretores: [], atores: [], linguagens: [], paises: []
    });
    const [altoContraste, setAltoContraste] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const carregarTudo = async () => {
            try {
                const pendentes = await buscarFilmesPendentes(token);
                setFilmesPendentes(pendentes);
            } catch (error) {
                console.error(error);
            }

            setSolicitacoes(listarSolicitacoes());

            const endpoints = ["categorias", "produtoras", "diretores", "atores", "linguagens", "paises"];
            const novasListas = {};
            for (let ep of endpoints) {
                novasListas[ep] = await buscarDadosAuxiliares(ep);
            }
            setDbListas(novasListas);
        };
        carregarTudo();
    }, []);

    const mostrarMensagem = (texto, tipo) => {
        setMensagem({ texto, tipo });
        setTimeout(() => setMensagem({ texto: "", tipo: "" }), 3000);
    };

    const handleAprovar = async (id) => {
        try {
            await aprovarFilme(id, token);
            setFilmesPendentes(filmesPendentes.filter(filme => filme.id !== id));
            mostrarMensagem("Filme aprovado! Ele já foi para o catálogo principal.", "sucesso");
        } catch (error) {
            mostrarMensagem(error.message || "Erro ao aprovar.", "erro");
        }
    };

    const handleReprovar = async (id) => {
        const confirmar = window.confirm("Tem certeza que deseja reprovar e excluir este filme permanentemente?");
        if (!confirmar) return;

        try {
            await deletarFilme(id, token);
            setFilmesPendentes(filmesPendentes.filter(filme => filme.id !== id));
            mostrarMensagem("Filme reprovado e removido do sistema.", "sucesso");
        } catch (error) {
            mostrarMensagem(error.message || "Erro ao reprovar.", "erro");
        }
    };

    const formatarNomeCompleto = (item) =>
        item.sobrenome ? `${item.nome} ${item.sobrenome}`.trim() : (item.nome || "").trim();

    const nomesDe = (campo, ids, isPerson = false) => {
        const lista = dbListas[campo] || [];
        return (ids || []).map((id) => {
            const item = lista.find((x) => String(x.id) === String(id));
            if (!item) return `#${id}`;
            return isPerson ? formatarNomeCompleto(item) : item.nome;
        }).join(", ") || "—";
    };

    const linhasComparacao = (sol) => {
        const a = sol.antes || {};
        const d = sol.depois || {};
        const ar = a.relacionais || {};
        const dr = d.relacionais || {};
        return [
            { label: "Título", antes: a.titulo, depois: d.titulo },
            { label: "Ano", antes: a.ano, depois: d.ano },
            { label: "Duração", antes: a.duracao, depois: d.duracao },
            { label: "Orçamento", antes: a.orcamento, depois: d.orcamento },
            { label: "Poster (URL)", antes: a.imagem, depois: d.imagem },
            { label: "Sinopse", antes: a.sinopse, depois: d.sinopse },
            { label: "Categorias", antes: nomesDe("categorias", ar.categorias), depois: nomesDe("categorias", dr.categorias) },
            { label: "Diretores", antes: nomesDe("diretores", ar.diretores, true), depois: nomesDe("diretores", dr.diretores, true) },
            { label: "Atores", antes: nomesDe("atores", ar.atores, true), depois: nomesDe("atores", dr.atores, true) },
            { label: "Linguagens", antes: nomesDe("linguagens", ar.linguagens), depois: nomesDe("linguagens", dr.linguagens) },
            { label: "Países", antes: nomesDe("paises", ar.paises), depois: nomesDe("paises", dr.paises) },
            { label: "Produtoras", antes: nomesDe("produtoras", ar.produtoras), depois: nomesDe("produtoras", dr.produtoras) },
        ];
    };

    const handleAprovarEdicao = async (sol) => {
        const d = sol.depois || {};
        const dr = d.relacionais || {};

        const payload = {
            titulo: d.titulo,
            ano: parseInt(d.ano) || 2026,
            sinopse: d.sinopse,
            duracao: d.duracao,
            imagem: d.imagem,
            orcamento: String(d.orcamento || "0"),
            categorias: (dr.categorias || []).map(Number),
            produtoras: (dr.produtoras || []).map(Number),
            diretores: (dr.diretores || []).map(Number),
            atores: (dr.atores || []).map(Number),
            linguagens: (dr.linguagens || []).map(Number),
            paises: (dr.paises || []).map(Number),
        };

        try {
            await editarFilme(sol.idFilme, payload, token);
            removerSolicitacao(sol.idSolicitacao);
            setSolicitacoes(listarSolicitacoes());
            mostrarMensagem("Edição aprovada e aplicada ao filme!", "sucesso");
        } catch (error) {
            mostrarMensagem(error.message || "Erro ao aplicar a edição.", "erro");
        }
    };

    const handleRecusarEdicao = (sol) => {
        const confirmar = window.confirm("Recusar esta solicitação de edição? O filme continuará como está.");
        if (!confirmar) return;

        removerSolicitacao(sol.idSolicitacao);
        setSolicitacoes(listarSolicitacoes());
        mostrarMensagem("Solicitação de edição recusada.", "sucesso");
    };

    return (
        <div className={altoContraste ? "pagina-admin modo-alto-contraste" : "pagina-admin"}>
            <NavBar
                funcaoContraste={() => setAltoContraste(!altoContraste)}
                estaAtivo={altoContraste}
            />

            <main className="admin-container">
                <div className="topo-admin">
                    <h2>Painel de Moderação</h2>
                    <p>Gerencie os filmes enviados pelos usuários antes que eles fiquem visíveis no catálogo.</p>
                </div>

                {mensagem.texto && (
                    <div className={`alerta-admin alert-${mensagem.tipo}`}>{mensagem.texto}</div>
                )}

                <h3 className="titulo-secao-admin">Filmes aguardando aprovação</h3>
                {filmesPendentes.length === 0 ? (
                    <div className="sem-pendentes">
                        <p>Nenhum filme aguardando aprovação no momento!</p>
                    </div>
                ) : (
                    <div className="grid-pendentes">
                        {filmesPendentes.map((filme) => (
                            <div key={filme.id} className="card-pendente">
                                <img
                                    src={filme.imagem || "https://via.placeholder.com/150"}
                                    alt={filme.titulo}
                                    className="poster-pendente"
                                />
                                <div className="info-pendente">
                                    <h3>{filme.titulo}</h3>
                                    <p className="ano-pendente">{filme.ano} • {filme.duracao}</p>
                                    <p className="sinopse-pendente">{filme.sinopse}</p>

                                    <div className="botoes-acoes">
                                        <button
                                            className="botao-aprovar"
                                            onClick={() => handleAprovar(filme.id)}
                                        >
                                            Aprovar e Publicar
                                        </button>
                                        <button
                                            className="botao-reprovar"
                                            onClick={() => handleReprovar(filme.id)}
                                        >
                                            Reprovar Filme
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="titulo-secao-admin">Solicitações de edição</h3>
                {solicitacoes.length === 0 ? (
                    <div className="sem-pendentes">
                        <p>Nenhuma solicitação de edição pendente.</p>
                    </div>
                ) : (
                    <div className="grid-pendentes">
                        {solicitacoes.map((sol) => (
                            <div key={sol.idSolicitacao} className="card-edicao">
                                <h3>{sol.tituloFilme}</h3>
                                <p className="ano-pendente">Comparação das alterações solicitadas:</p>

                                <div className="comparacao-edicao">
                                    <div className="comparacao-cabecalho">
                                        <span>Campo</span>
                                        <span>Antes</span>
                                        <span>Depois</span>
                                    </div>
                                    {linhasComparacao(sol).map((linha) => {
                                        const mudou = String(linha.antes ?? "") !== String(linha.depois ?? "");
                                        return (
                                            <div key={linha.label} className={`comparacao-linha ${mudou ? "mudou" : ""}`}>
                                                <span className="comp-campo">{linha.label}</span>
                                                <span className="comp-antes">{linha.antes || "—"}</span>
                                                <span className="comp-depois">{linha.depois || "—"}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="botoes-acoes">
                                    <button className="botao-aprovar" onClick={() => handleAprovarEdicao(sol)}>
                                        Aprovar Edição
                                    </button>
                                    <button className="botao-reprovar" onClick={() => handleRecusarEdicao(sol)}>
                                        Recusar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer logOut={logOut} />
        </div>
    );
}
