import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../../services/api";
import NavBar from "../../../components/navBar/navBar";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const [altoContraste, setAltoContraste] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        data_nascimento: ""
    });
    
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro("");

        try {
            await registrarUsuario(formData);
            navigate("/login");
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={altoContraste ? "pagina-cadastro modo-alto-contraste" : "pagina-cadastro"}>
            <NavBar
                funcaoContraste={() => setAltoContraste(!altoContraste)}
                estaAtivo={altoContraste}
            />

            <main className="cadastro-container">
                <form className="cadastro-form" onSubmit={handleRegister}>
                    <h2>Criar Conta</h2>
                    
                    {erro && <p className="mensagem-erro">{erro}</p>}

                    <div className="linha-inputs">
                        <div className="grupo-input">
                            <label>Nome</label>
                            <input type="text" name="nome" required onChange={handleChange} />
                        </div>
                        <div className="grupo-input">
                            <label>Sobrenome</label>
                            <input type="text" name="sobrenome" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grupo-input">
                        <label>E-mail</label>
                        <input type="email" name="email" required onChange={handleChange} />
                    </div>

                    <div className="grupo-input">
                        <label>Senha</label>
                        <input type="password" name="senha" required onChange={handleChange} />
                    </div>

                    <div className="grupo-input">
                        <label>Data de Nascimento</label>
                        <input type="date" name="data_nascimento" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="botao-cadastrar" disabled={loading}>
                        {loading ? "Criando conta..." : "Cadastrar"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: "10px", color: "var(--txt-secundario)" }}>
                        Já tem uma conta? <Link to="/login" style={{ color: "var(--primary)" }}>Faça Login</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}