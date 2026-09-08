from infra.database import *
from etc.colors import Colors

colors = Colors()

TABELAS = ["ator", "diretor"]

def loadActorsDirector(tabela):
    if tabela not in TABELAS:
        raise ValueError("Tabela inválida!")

    db = get_connection()
    cursor = db.cursor()

    cursor.execute(f"SELECT * FROM {tabela}")
    results = cursor.fetchall()

    cursor.close()
    db.close()
    print(colors.colorize("------------- ATORES -----------", "magenta"))
    print(results)
    return [
        {
            "id": item[0],
            "nome": item[1],
            "sobrenome": item[2],
            "id_genero": item[3]
        }
        for item in results
    ]


def insertActorDirector(tabela, nome, sobrenome, genero=3):
    if tabela not in TABELAS:
        raise ValueError("Tabela inválida!")

    db = get_connection()
    cursor = db.cursor()

    cursor.execute(
        f"INSERT INTO {tabela} (nome, sobrenome, id_genero) VALUES (%s, %s, %s)",
        (nome, sobrenome, genero)
    )

    db.commit()
    cursor.close()
    db.close()

    return loadActorsDirector(tabela)

def deleteActorsDirector(tabela, id_item):
    if tabela not in TABELAS:
        raise ValueError("Tabela inválida!")

    db = get_connection()
    cursor = db.cursor()

    cursor.execute(f"SELECT * FROM {tabela} WHERE id_{tabela} = %s", (id_item,))
    if not cursor.fetchone():
        cursor.close()
        db.close()
        return {"error": f"{tabela} não encontrado"}

    if tabela == "ator":
        cursor.execute(
            "SELECT * FROM filme_ator WHERE id_ator = %s",
            (id_item,)
        )
    else:  
        cursor.execute(
            "SELECT * FROM filme_diretor WHERE id_diretor = %s",
            (id_item,)
        )

    if cursor.fetchone():
        cursor.close()
        db.close()
        return {
            "error": f"Não é possível deletar {tabela}. Está vinculado a um ou mais filmes."
        }

    cursor.execute(
        f"DELETE FROM {tabela} WHERE id_{tabela} = %s",
        (id_item,)
    )

    db.commit()
    cursor.close()
    db.close()

    return loadActorsDirector(tabela)

def get_or_create_person(tabela, nome_completo):
    if tabela not in TABELAS:
        raise ValueError("Tabela inválida!")

    nome_completo = str(nome_completo).strip()
    if not nome_completo:
        return None

    partes = nome_completo.split(" ", 1)
    nome = partes[0]
    sobrenome = partes[1] if len(partes) > 1 else ""

    db = get_connection()
    cursor = db.cursor()

    cursor.execute(
        f"SELECT id_{tabela} FROM {tabela} WHERE nome = %s AND sobrenome = %s", 
        (nome, sobrenome)
    )
    result = cursor.fetchone()

    if result:
        id_person = result[0]
    else:
        cursor.execute(
            f"INSERT INTO {tabela} (nome, sobrenome, id_genero) VALUES (%s, %s, %s)",
            (nome, sobrenome, 3)
        )
        db.commit()
        id_person = cursor.lastrowid

    cursor.close()
    db.close()
    
    return id_person