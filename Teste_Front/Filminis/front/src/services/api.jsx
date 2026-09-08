const API_URL = import.meta.env.VITE_API_URL;

export async function buscarFilmes() {
    try {
        const resposta = await fetch(`${API_URL}/listagem`);
        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes");
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        return [];
    }
}

export async function filmeID(id) {
    try {
        const resposta = await fetch(`${API_URL}/filme?id=${id}`);
        if (!resposta.ok) {
            throw new Error("Erro ao buscar filme.");
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        return [];
    }
}

export async function loginUsuario(email, password) {
    try {
        const resposta = await fetch(`${API_URL}/send_loginho`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email, password }).toString(),
        });
        if (!resposta.ok) {
            throw new Error('Erro de Login');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        return null;
    }
}

export async function buscarDadosAuxiliares(rota) {
    try {
        const resposta = await fetch(`${API_URL}/${rota}`);
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar ${rota}`);
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        return [];
    }
}

export async function adicionarFilme(filmeData, token) {
    try {
        const resposta = await fetch(`${API_URL}/cadastrani`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filmeData)
        });
        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar o filme. Verifique os dados.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function registrarUsuario(dadosUsuario) {
    try {
        const resposta = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosUsuario)
        });
        if (!resposta.ok) {
            throw new Error('Erro ao criar conta. Verifique os dados ou se o email já existe.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function buscarFilmesPendentes(token) {
    try {
        const resposta = await fetch(`${API_URL}/filmes-pendentes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao buscar os filmes pendentes. Verifique se você tem permissão de Admin.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function aprovarFilme(idFilme, token) {
    try {
        const resposta = await fetch(`${API_URL}/aprovafilme?id=${idFilme}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao tentar aprovar o filme.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function buscarPerfil(token) {
    try {
        const resposta = await fetch(`${API_URL}/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao carregar perfil.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function atualizarFotoPerfil(formData, token) {
    try {
        const resposta = await fetch(`${API_URL}/me/foto`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        if (!resposta.ok) {
            const dadosErro = await resposta.json();
            throw new Error(dadosErro.error || 'Erro ao atualizar a foto.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function deletarFilme(idFilme, token) {
    try {
        const resposta = await fetch(`${API_URL}/filme?id=${idFilme}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao deletar o filme permanentemente.');
        }
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}

export async function editarFilme(id, filmeData, token) {
    try {
        const resposta = await fetch(`${API_URL}/filme?id=${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(filmeData)
        });
        
        if (!resposta.ok) {
            const errorData = await resposta.json().catch(() => null);
            throw new Error(errorData?.error || 'Erro ao solicitar a edição do filme.');
        }
        
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error(erro);
        throw erro;
    }
}