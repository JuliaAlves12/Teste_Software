const CHAVE = "solicitacoes_edicao_cinelist";

export function listarSolicitacoes() {
    const dados = localStorage.getItem(CHAVE);
    if (!dados) return [];
    return JSON.parse(dados);
}

export function salvarSolicitacao(solicitacao) {
    const lista = listarSolicitacoes();
    lista.push(solicitacao);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}

export function removerSolicitacao(idSolicitacao) {
    const lista = listarSolicitacoes();
    const novaLista = lista.filter((item) => item.idSolicitacao !== idSolicitacao);
    localStorage.setItem(CHAVE, JSON.stringify(novaLista));
}
