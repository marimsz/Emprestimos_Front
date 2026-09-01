'use client';

import { useState, useEffect } from "react";

interface Emprestimo {
    type: string,
    interest_rate: number;
}

interface Resultado {
    customer: string,
    loans: Emprestimo[];
}

interface Cliente {
  cpf: string,
  nome: string,
  idade: number,
  renda_mensal: number,
  estado_onde_reside: string,
}

const API_URL = "https://analise-emprestimos.onrender.com";

export default function Analise() {
    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [rendaMensal, setRendaMensal] = useState("");
    const [estado, setEstado] = useState("");

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [resultado, setResultado] = useState<Resultado | null>(null);
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);


    async function carregarClientes() {
      try {
        console.log("Buscado clientes em:", `${API_URL}/customers`);

        const resposta = await fetch(`${API_URL}/customer-loans`);

        console.log("Status:", resposta.status);

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log("Clientes recebidos:", dados);

        setClientes(dados);
      } catch (error) {
        console.error(error);
        setMensagem("Erro ao carregar clientes cadastrados.")
      }
    }

    useEffect(() =>{
        carregarClientes();
    }, []);

    function selecionarCliente(cliente: Cliente) {
      setCpf(cliente.cpf);
      setNome(cliente.nome);
      setIdade(String(cliente.idade));
      setRendaMensal(String(cliente.renda_mensal));
      setEstado(cliente.estado_onde_reside);

      setMensagem(
        `Cliente ${cliente.nome} selecionado para análise.`
      );
    }

    async function analisarEmprestimo( 
        e: React.FormEvent
    ) {
        e.preventDefault();

        setMensagem("");
        setResultado(null);
        setCarregando(true);

        try {
            const resposta = await fetch(
                `${API_URL}/customer-loans`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cpf,
                    nome,
                    idade: Number(idade),
                    renda_mensal: Number(rendaMensal),
                    estado_onde_reside: estado,
                })
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const dados: Resultado = await resposta.json();

        console.log("Resultado da análise:", dados);

        setResultado(dados);

        if (dados.loans.length === 0) {
            setMensagem(
                "Nenhum empréstimo disponível para este cliente."
            );
        }

        } catch (error) {
            console.error(error);
            setMensagem(
                "Erro ao realizar análise de empréstimo."
            );
        } finally {
            setCarregando(false)
        }
    }

    function limparFormulario() {
        setCpf("");
        setNome("");
        setIdade("");
        setRendaMensal("");
        setEstado("");
        setResultado(null);
        setMensagem("");
    }

    function nomeEmprestimo(tipo: string) {
        switch (tipo) {
            case "PERSONAL":
                return "Empréstimo Pessoal";

            case "GUARANTEED":
                return "Empréstimo com Garantia";

            case "CONSIGNMENT":
                return "Empréstimo Consignado";

            default:
                return tipo;
        }
    }

   return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #dbeafe, #eff6ff, #ffffff)",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        maxWidth: "1000px",
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
        Análise de Emprétimo
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#555",
          marginBottom: "30px",
        }}
      >
        Consulte quais modalidades de empréstimo estão disponíveis para o cliente.
      </p>


      {/* CLIENTES CADASTRADOS */}

      <section
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            color: "#1e3a5f",
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          Clientes Cadastrados
        </h2>


        {clientes.length === 0 ? (

          <p
            style={{
              textAlign: "center",
              color: "#777",
              padding: "20px",
            }}
          >
            Nenhum cliente cadastrado
          </p>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    backgroundColor: "#1e3a5f",
                    color: "white",
                  }}
                >

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                    }}
                  >
                    CPF
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                    }}
                  >
                    Nome
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    Idade
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                    }}
                  >
                    Renda
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    Estado
                  </th>

                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    Ação
                  </th>

                </tr>

              </thead>


              <tbody>

                {clientes.map((cliente, index) => (

                  <tr
                    key={cliente.cpf}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "#f8fafc"
                          : "white",
                      borderBottom:
                        "1px solid #ddd",
                    }}
                  >

                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      {cliente.cpf}
                    </td>


                    <td
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {cliente.nome}
                    </td>


                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      {cliente.idade}
                    </td>


                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      R${" "}
                      {Number(
                        cliente.renda_mensal
                      ).toFixed(2)}
                    </td>


                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#1e3a5f",
                      }}
                    >
                      {cliente.estado_onde_reside}
                    </td>


                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          selecionarCliente(cliente)
                        }
                        style={{
                          backgroundColor:
                            "#2e7d32",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Analisar
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* DADOS DO CLIENTE */}

      <section
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
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


        <form onSubmit={analisarEmprestimo}>

          {/* CPF */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >

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


            <input
              type="text"
              value={cpf}
              onChange={(e) =>
                setCpf(e.target.value)
              }
              placeholder="Digite o CPF"
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


          {/* Nome */}

          <div
            style={{
              marginBottom: "15px",
            }}
          >

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
              onChange={(e) =>
                setNome(e.target.value)
              }
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
              gridTemplateColumns:
                "1fr 1fr",
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
                onChange={(e) =>
                  setIdade(e.target.value)
                }
                placeholder="Idade"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
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
                onChange={(e) =>
                  setRendaMensal(
                    e.target.value
                  )
                }
                placeholder="Renda mensal"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />

            </div>

          </div>


          {/* Estado */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

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
              onChange={(e) =>
                setEstado(e.target.value)
              }
              placeholder="Ex: PE"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />

          </div>


          {/* Botões */}

          <button
            type="submit"
            disabled={carregando}
            style={{
              backgroundColor:
                carregando
                  ? "#90a4ae"
                  : "#2e7d32",
              color: "white",
              border: "none",
              padding:
                "12px 25px",
              borderRadius: "6px",
              cursor: carregando
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            {carregando
              ? "Analisando..."
              : "Analisar Empréstimo"}
          </button>


          <button
            type="button"
            onClick={limparFormulario}
            style={{
              backgroundColor: "#757575",
              color: "white",
              border: "none",
              padding:
                "12px 22px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Limpar
          </button>

        </form>

      </section>


      {/* MENSAGEM */}

      {mensagem && (

        <p
          style={{
            padding: "12px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          {mensagem}
        </p>

      )}


      {/* RESULTADO */}

      {resultado &&
        resultado.loans.length > 0 && (

          <section
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >

            <h2
              style={{
                color: "#1e3a5f",
                marginTop: 0,
              }}
            >
              Resultado da Análise
            </h2>


            <p
              style={{
                color: "#555",
                marginBottom: "20px",
              }}
            >
              Cliente:{" "}

              <strong>
                {resultado.customer}
              </strong>
            </p>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >

              {resultado.loans.map(
                (emprestimo, index) => (

                  <div
                    key={index}
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "20px",
                      backgroundColor:
                        "#f8fafc",
                    }}
                  >

                    <h3
                      style={{
                        color: "#1e3a5f",
                        marginTop: 0,
                      }}
                    >
                      {nomeEmprestimo(
                        emprestimo.type
                      )}
                    </h3>


                    <p
                      style={{
                        color: "#555",
                      }}
                    >
                      Tipo:{" "}

                      <strong>
                        {emprestimo.type}
                      </strong>
                    </p>


                    <p
                      style={{
                        color: "#2e7d32",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Taxa de juros:{" "}

                      {emprestimo.interest_rate}%
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}


      {/* NAVEGAÇÃO */}

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
        }}
      >

        <button
          onClick={() =>
            window.location.href =
              "/clientes"
          }
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
          Clientes
        </button>


        <button
          onClick={() =>
            window.location.href =
              "/"
          }
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
          Início
        </button>

      </div>

    </div>

  </main>
); 

}