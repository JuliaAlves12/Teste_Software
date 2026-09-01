import { useState } from 'react';

function Home() {
  const [mensagem, setMensagem] = useState('');

  const handleClick = () => {
    setMensagem('Botão clicado com sucesso!');
  };

  return (
    <div>
      <h1>Página Home</h1>
      <input data-cy="input-nome" placeholder='Digite seu nome sua linda perfeita maravilhosa gold venonextreme jazzghost malena0202 baixamemoria authenticgames moonkase jvnq alanzoka'></input>
      {/* Aonde voce quer utilizar um elemento com ID no CYPRESS, utilize cy-data para serum id igual ao do CSS */}
      <button onClick={handleClick} data-cy="botao-acao">
        Clique aqui
      </button>
      {mensagem && <p data-cy="mensagem-resultado">{mensagem}</p>}
    </div>
  );
}

export default Home;