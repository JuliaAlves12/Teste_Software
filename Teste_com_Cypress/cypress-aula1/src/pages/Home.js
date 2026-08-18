import { useState } from 'react';

function Home() {
  const [mensagem, setMensagem] = useState('');

  const handleClick = () => {
    setMensagem('Botão clicado com sucesso!');
  };

  return (
    <div>
      <h1>Página Home</h1>
      <button onClick={handleClick} data-cy="botao-acao">
        Clique aqui
      </button>
      {mensagem && <p data-cy="mensagem-resultado">{mensagem}</p>}
    </div>
  );
}

export default Home;