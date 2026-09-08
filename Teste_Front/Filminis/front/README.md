# Filminis

Sistema de gerenciamento de filmes desenvolvido com React, Python e MySQL.

## Tecnologias Utilizadas

- React.js
- Vite
- CSS
- Python
- MySQL

## Configuração do Banco de Dados

Antes de iniciar o sistema, execute o script SQL localizado em:

```text
back/bcd_novo_julia.sql
```

Esse arquivo contém toda a estrutura necessária para criação do banco de dados e das tabelas utilizadas pela aplicação.

Após executar o script no MySQL Workbench, verifique se as credenciais configuradas no arquivo `infra/database.py` correspondem às credenciais do seu ambiente.

## Executando o Back-end

Acesse a pasta do servidor:

```bash
cd back
cd FILMESERVER
```

Instale as dependências (via requirements):

```bash
pip install -r requirements.txt
```

Ou instale manualmente:

```bash
pip install mysql-connector-python pyjwt
```

Inicie o servidor:

```bash
py server.py
```

O servidor será iniciado em:

```text
http://localhost:8000
```

## Executando o Front-end

Acesse a pasta do projeto:

```bash
cd front
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O terminal exibirá o endereço para acesso ao sistema.

## Usuários para Teste

### Administrador

```text
E-mail: admin@example.com
Senha: admin
```

### Usuário

```text
E-mail: usuario@mail.com
Senha: 123456
```

Também é possível criar uma nova conta pela tela de cadastro.

## Permissões

### Usuário

- Visualizar filmes
- Acessar detalhes dos filmes
- Favoritar filmes
- Visualizar favoritos
- Cadastrar filmes
- Solicitar edições

### Administrador

- Visualizar filmes
- Acessar detalhes dos filmes
- Favoritar filmes
- Visualizar seus favoritos
- Cadastrar filmes
- Editar filmes
- Aprovar ou reprovar conteúdos enviados por usuários
- Excluir filmes

## Funcionalidades

- Cadastro de filmes
- Listagem de filmes
- Edição de filmes
- Solicitação de edição de filmes (com comparação antes e depois)
- Exclusão de filmes
- Sistema de favoritos
- Aprovação e reprovação de conteúdos
- Busca por título
- Busca por ano
- Busca por categoria
- Busca por diretor
- Busca por atores
- Modo alto contraste

## Observações

- Execute o arquivo `back/bcd_novo_julia.sql` antes de iniciar o sistema.
- O Back-end deve estar em execução para que o Front-end funcione corretamente.
- Execute `pip install mysql-connector-python pyjwt` no Back-end e `npm install` no Front-end antes da primeira execução.