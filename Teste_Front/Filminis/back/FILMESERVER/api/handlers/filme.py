import json
from urllib.parse import parse_qs, urlparse
from infra.database import *
from infra.users_database import *
from infra.actorsDirectors import loadActorsDirector, insertActorDirector, get_or_create_person
from infra.genresProducers import loadGenresProducer, insertGenresProducer, get_or_create_generic

from api.jwt import *
from etc.colors import Colors

colors = Colors()

def get_Listagem(handler):
    filmes = loadFilminhos()
    handler._send_json(filmes)

def get_Atores(handler):
    atores = loadActorsDirector("ator")
    handler._send_json(atores)

def get_Diretores(handler):
    diretores = loadActorsDirector("diretor")
    handler._send_json(diretores)

def get_Categorias(handler):
    categorias = loadGenresProducer("categoria")
    handler._send_json(categorias)

def get_Produtoras(handler):
    produtoras = loadGenresProducer("produtora")
    handler._send_json(produtoras)

def get_Linguagem(handler):
    linguagens = loadGenresProducer("linguagem")
    handler._send_json(linguagens)

def get_Pais(handler):
    paises = loadGenresProducer("pais")
    handler._send_json(paises)

def get_FilmesPendentes(handler):
    header_auth = handler.headers.get("Authorization", "")

    if not header_auth.startswith("Bearer "):
        handler._send_json({"error": "Token não informado"}, 401)
        return

    token = header_auth.split(" ")[1]
    payload = verify_jwt(token)
    print(token)
    if not payload or payload.get("role") != "admin":
        handler._send_json({"error": "Acesso permitido apenas para admin"}, 403)
        return

    filmes = loadFilminhosPendentes() 

    handler._send_json(filmes)

def get_Filmes(handler):
    query_params = parse_qs(urlparse(handler.path).query)

    try:
        id = int(query_params.get('id', [''])[0])
    except:
        handler._send_json({"error": "ID inválido"}, 400)
        return

    filme = loadFilmini(id)
    print(filme)

    handler._send_json(filme)

def post_AddCat(handler):
    header_auth = handler.headers.get("Authorization", "")
    content_length = int(handler.headers['Content-length'])
    body = handler.rfile.read(content_length).decode('utf-8')
    form_data = parse_qs(body)

    propriedade = form_data.get('cat', [""])[0]
    nome = str(form_data.get('nome', [""])[0])

    print(colors.colorize("Data form", "green"))
    print("Propriedade: ", propriedade)
    print("Nome: ", nome)
    r = "" 
    tabela = ""

    match propriedade:
        case "Atores Principais":
            tabela = "ator"
            name = nome.split()
            primeiro = name[0]
            sobrenome = name[1] if len(name) > 1 else ""
            genero = form_data.get('genero', [""])[0]

            print(primeiro, sobrenome)
            r = insertActorDirector(tabela, primeiro, sobrenome, genero)
        case "Diretores":
            tabela = "diretor"
            name = nome.split()
            primeiro = name[0]
            sobrenome = name[1] if len(name) > 1 else ""
            genero = form_data.get('genero', [""])[0]

            r = insertActorDirector(tabela, primeiro, sobrenome, genero)
        case "Linguagem":
            tabela = "linguagem"
            r = insertGenresProducer(tabela, nome)
        case "País de Origem":
            tabela = "pais"
            r = insertGenresProducer(tabela, nome)
        case "Produtora":
            tabela = "produtora"
            r = insertGenresProducer(tabela, nome)
        case "Categorias":
            tabela = "categoria"
            r = insertGenresProducer(tabela, nome)
    
    print(tabela, r)

    if auth_token(header_auth):
        handler._send_json(r)
    else:
        handler._send_json({"error": "Token inválido ou expirado"}, 401)


def post_Cadastrani(handler):
    header_auth = handler.headers.get("Authorization", "")

    if not header_auth.startswith("Bearer "):
        handler._send_json({"error": "Token não informado"}, 401)
        return

    token = header_auth.split(" ")[1]
    payload = verify_jwt(token)

    if not payload:
        handler._send_json({"error": "Token inválido ou expirado"}, 401)
        return

    flag = 0

    content_length = int(handler.headers['Content-Length'])
    body = handler.rfile.read(content_length).decode('utf-8')

    try:
        data = json.loads(body)
    except:
        handler._send_json({"error": "JSON inválido"}, 400)
        return

    nome = data.get("titulo")
    ano = int(data.get("ano", 0))
    sinopse = data.get("sinopse")
    duracao = data.get("duracao")
    poster = data.get("imagem")

    orcamento_raw = data.get("orcamento", "0")
    
    if isinstance(orcamento_raw, str):
        orcamento = int(
            orcamento_raw
            .replace("R$", "")
            .replace(".", "")
            .replace(",", "")
            .strip()
        )
    else:
        orcamento = int(orcamento_raw)

    atores_nomes = data.get("atores", [])
    diretores_nomes = data.get("diretores", [])
    categorias_nomes = data.get("categorias", [])
    produtoras_nomes = data.get("produtoras", [])
    linguagens_nomes = data.get("linguagens", [])
    paises_nomes = data.get("paises", [])

    atores_ids = [get_or_create_person("ator", nome) for nome in atores_nomes if str(nome).strip()]
    diretores_ids = [get_or_create_person("diretor", nome) for nome in diretores_nomes if str(nome).strip()]
    
    categorias_ids = [get_or_create_generic("categoria", cat) for cat in categorias_nomes if str(cat).strip()]
    produtoras_ids = [get_or_create_generic("produtora", prod) for prod in produtoras_nomes if str(prod).strip()]
    linguagens_ids = [get_or_create_generic("linguagem", ling) for ling in linguagens_nomes if str(ling).strip()]
    paises_ids = [get_or_create_generic("pais", pais) for pais in paises_nomes if str(pais).strip()]

    produtora_principal = produtoras_ids[0] if produtoras_ids else None

    resp = insertFilminhos(
        nome=nome,
        produtora_principal=produtora_principal,
        produtoras=produtoras_ids,
        categorias=categorias_ids,
        atores=atores_ids,
        diretores=diretores_ids,
        linguagens=linguagens_ids,
        paises=paises_ids,
        orcamento=orcamento,
        duracao=duracao,
        sinopse=sinopse,
        ano=ano,
        poster=poster,
        flag=flag 
    )

    handler._send_json({
        "id": resp.get("id") if resp else None,
        "aprovado": False,
        "message": "Filme enviado para aprovação com sucesso!"
    }, 201)


def put_AprovaFilme(handler):
    try:
        header_auth = handler.headers.get("Authorization", "")

        if not header_auth.startswith("Bearer "):
            handler._send_json({"error": "Token não informado"}, 401)
            return

        token = header_auth.split(" ")[1]
        payload = verify_jwt(token)

        if not payload or payload.get("role") != "admin":
            handler._send_json({"error": "Apenas admin pode aprovar filmes"}, 403)
            return

        params = parse_qs(urlparse(handler.path).query)
        filme_id = params.get("id", [None])[0]

        try:
            filme_id = int(filme_id)
        except:
            handler._send_json({"error": "ID inválido"}, 400)
            return

        sucesso = aprovarFilmini(filme_id)

        if sucesso:
            handler._send_json({"message": "Filme aprovado com sucesso"})
        else:
            handler._send_json({"error": "Filme não encontrado"}, 404)

    except Exception as e:
        print("ERRO PUT:", e)
        handler._send_json({"error": str(e)}, 500)


def patch_Filme(handler):
    header_auth = handler.headers.get("Authorization", "")

    if not header_auth.startswith("Bearer "):
        handler._send_json({"error": "Token não informado"}, 401)
        return

    token = header_auth.split(" ")[1]
    payload = verify_jwt(token)

    if not payload or payload.get("role") != "admin":
        handler._send_json({"error": "Apenas admin pode editar filmes"}, 403)
        return

    params = parse_qs(urlparse(handler.path).query)
    id_filme = params.get("id", [None])[0]

    try:
        id_filme = int(id_filme)
    except:
        handler._send_json({"error": "ID inválido"}, 400)
        return

    filme = getFilmeById(id_filme)

    if not filme:
        handler._send_json({"error": "Filme não encontrado"}, 404)
        return

    if filme["flag"] == 0:
        handler._send_json({"error": "Filme ainda não aprovado"}, 403)
        return

    content_length = int(handler.headers.get('Content-Length', 0))
    body = handler.rfile.read(content_length).decode('utf-8')

    try:
        data = json.loads(body)
    except:
        handler._send_json({"error": "JSON inválido"}, 400)
        return

    campos_para_atualizar = {}

    if "titulo" in data:
        campos_para_atualizar["titulo"] = data["titulo"]

    if "id_produtora_principal" in data:
        campos_para_atualizar["id_produtora_principal"] = data["id_produtora_principal"]

    if "orcamento" in data:
        campos_para_atualizar["orcamento"] = int(
            data["orcamento"]
            .replace("R$", "")
            .replace(".", "")
            .replace(",", "")
            .strip()
        )

    if "duracao" in data:
        campos_para_atualizar["duracao"] = data["duracao"]

    if "sinopse" in data:
        campos_para_atualizar["sinopse"] = data["sinopse"]

    if "ano" in data:
        campos_para_atualizar["ano"] = int(data["ano"])

    if "imagem" in data:
        campos_para_atualizar["poster"] = data["imagem"]

    if campos_para_atualizar:
        patchCamposFilme(id_filme, campos_para_atualizar)

    if "atores" in data:
        patchRelacionamento(id_filme, "filme_ator", "id_ator", data["atores"])

    if "diretores" in data:
        patchRelacionamento(id_filme, "filme_diretor", "id_diretor", data["diretores"])

    if "categorias" in data:
        patchRelacionamento(id_filme, "filme_categoria", "id_categoria", data["categorias"])

    if "linguagens" in data:
        patchRelacionamento(id_filme, "filme_linguagem", "id_linguagem", data["linguagens"])

    if "paises" in data:
        patchRelacionamento(id_filme, "filme_pais", "id_pais", data["paises"])

    if "produtoras" in data:
        patchRelacionamento(id_filme, "filme_produtora", "id_produtora", data["produtoras"])

    handler._send_json({"message": "Filme editado com sucesso"})