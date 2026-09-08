import "./Footer.css";

export default function Footer({ logOut }) {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>© 2026 Cinelist. Seu catálogo de filmes favoritos.</p>
                <button className="botao-logout-footer" onClick={logOut}>
                    Sair da Conta
                </button>
            </div>
        </footer>
    );
}