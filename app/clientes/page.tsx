'use client';

import { useEffect, useState } from "react";


interface Cliente {
    cpf: string,
    nome: string,
    idade: number,
    renda_mensal: number,
    estado_onde_reside: string
}

const API_URL = "https://analise-emprestimos.onrender.com";

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [rendaMensal, setRendaMensal] = useState("");
    const [estado, setEstado] = useState("");

    const [mensagem, setMensagem] = useState("");

    //Listar Clientes
     async function listarClientes() {
        const url = `${API_URL}/customers`;

        console.log("API_URL:", API_URL);
        console.log("URL completa:", url);

      try {
        const resposta = await fetch(url);

        console.log("Status:", resposta.status);
        console.log("OK:", resposta.ok);

        const dados = await resposta.json();

        setClientes(dados)
        console.log("Dados:", dados);
      } catch (erro) {
         console.error("ERRO NO FETCH:", erro);
      }
    }

    //Cadastrar Clientes
    async function cadastrarCliente(e: React.FormEvent) {
        e.preventDefault();

        try {
            const resposta = await fetch(`${API_URL}/customers`, {
               method: "POST",
               headers: {
                "Content-type": 'application/json',
               },
               body: JSON.stringify({
                cpf,
                nome,
                idade: Number(idade),
                renda_mensal: Number(rendaMensal),
                estado_onde_reside: estado,
               }),
            });

            if (!resposta.ok) {
                throw new Error("Erro ao cadastrar cliente");
            }

            alert("Cliente Cadastrado com sucesso!")

            setMensagem("Cliente cadastrado com sucesso!");

            limparFormulario();
            await listarClientes();
        } catch (error) {
          console.log(error)
            setMensagem("Erro ao cadastrar cliente.")
        }
    }

    //Buscar por CPF
    async function buscarPorCpf() {
        if (!cpf) {
            setMensagem("Digite um CPF para buscar");
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/customers/${cpf}`);

            if (!resposta.ok) {
                setMensagem("Cliente não encontrado.");
                return;
            }

            const cliente: Cliente = await resposta.json();

            setNome(cliente.nome);
            setIdade(String(cliente.idade));
            setRendaMensal(String(cliente.renda_mensal));
            setEstado(cliente.estado_onde_reside);

            setMensagem("Cliente encontrado.");
        } catch (error) {
            console.error(error); 
                setMensagem("Erro ao buscar cliente.");
            }
    }

    //Atualizar Cliente
    async function atualizarCliente() {
        if (!cpf) {
            setMensagem("Digite o CPF do cliente.");
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/customers/${cpf}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                nome,
                idade: Number(idade),
                renda_mensal: Number(rendaMensal),
                estado_onde_reside: estado,
              }),
            });

            if (!resposta.ok) {
                throw new Error("Erro ao atualizar cliente");
            }

            setMensagem("Cliente atualizado com sucesso!");

            limparFormulario();
            listarClientes();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao atualizar cliente."); 
        }
    }
    
    //Deletar Clientes
    async function deletarCliente(cpfCliente: string) {
        const confirmar = window.confirm(
            "Tem certeza que deseja deletar este cliente?"
        );

        if (!confirmar) {
           return; 
        }

        try {
            const resposta = await fetch(`${API_URL}/customers/${cpfCliente}`, {
                method: "DELETE"
            });

            if (!resposta.ok) {
                throw new Error("Erro ao deletar cliente");
            }

            setMensagem("Cliente deletado com sucesso!");

            listarClientes();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao deletar cliente.");
        }
    }

    //Limpar Formulario
    function limparFormulario() {
        setCpf("");
        setNome("");
        setIdade("");
        setRendaMensal("");
        setEstado("");
    }

    //Carregar Clientes
    useEffect(() => {
        listarClientes();
    }, []);

return (
  <main
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #dbeafe, #eff6ff, #ffffff)",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Título */}
      <h1
        style={{
          textAlign: "center",
          color: "#1e3a5f",
          fontSize: "36px",
          marginBottom: "10px",
        }}
      >
        Cadastro de Clientes
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#555",
          marginBottom: "30px",
        }}
      >
        Cadastre, consulte, atualize e remova clientes.
      </p>

      {/* Mensagem */}
      {mensagem && (
        <p
          style={{
            padding: "12px",
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          {mensagem}
        </p>
      )}

      {/* Formulário */}
      <section
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#1e3a5f",
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          Dados do Cliente
        </h2>

        <form onSubmit={cadastrarCliente}>
          
          {/* CPF */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              CPF
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite o CPF"
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />

              <button
                type="button"
                onClick={buscarPorCpf}
                style={{
                  backgroundColor: "#1e3a5f",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Nome */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Idade e renda */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Idade
              </label>

              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Idade"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Renda mensal
              </label>

              <input
                type="number"
                value={rendaMensal}
                onChange={(e) => setRendaMensal(e.target.value)}
                placeholder="Renda mensal"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>

          {/* Estado */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Estado onde reside
            </label>

            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Ex: PE"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Botões */}
          <div>
            <button
              type="submit"
              style={{
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Cadastrar
            </button>

            <button
              type="button"
              onClick={atualizarCliente}
              style={{
                backgroundColor: "#1e3a5f",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              Atualizar
            </button>

            <button
              type="button"
              onClick={limparFormulario}
              style={{
                backgroundColor: "#757575",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Limpar
            </button>
          </div>
        </form>
      </section>

      {/* Lista de clientes */}
      <section
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#1e3a5f",
              margin: 0,
            }}
          >
            Clientes Cadastrados
          </h2>

          <button
            onClick={listarClientes}
            style={{
              backgroundColor: "#1e3a5f",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Atualizar lista
          </button>
        </div>

        {clientes.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#777",
              padding: "30px",
            }}
          >
            Nenhum cliente cadastrado.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#1e3a5f",
                    color: "white",
                  }}
                >
                  <th style={{ padding: "14px", textAlign: "left" }}>
                    CPF
                  </th>

                  <th style={{ padding: "14px", textAlign: "left" }}>
                    Nome
                  </th>

                  <th style={{ padding: "14px", textAlign: "center" }}>
                    Idade
                  </th>

                  <th style={{ padding: "14px", textAlign: "right" }}>
                    Renda
                  </th>

                  <th style={{ padding: "14px", textAlign: "center" }}>
                    Estado
                  </th>

                  <th style={{ padding: "14px", textAlign: "center" }}>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente, index) => (
                  <tr
                    key={cliente.cpf}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "#f8fafc" : "white",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      {cliente.cpf}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {cliente.nome}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                      }}
                    >
                      {cliente.idade}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "right",
                      }}
                    >
                      R${" "}
                      {Number(cliente.renda_mensal).toFixed(2)}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#1e3a5f",
                      }}
                    >
                      {cliente.estado_onde_reside}
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        onClick={() => {
                          setCpf(cliente.cpf);
                          setNome(cliente.nome);
                          setIdade(String(cliente.idade));
                          setRendaMensal(
                            String(cliente.renda_mensal)
                          );
                          setEstado(
                            cliente.estado_onde_reside
                          );
                        }}
                        style={{
                          backgroundColor: "#1e3a5f",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginRight: "6px",
                        }}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          deletarCliente(cliente.cpf)
                        }
                        style={{
                          backgroundColor: "#c62828",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  </main>
);

}