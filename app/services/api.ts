const API_URL = "http://localhost:3001/analise";

export async function listarClientes() {
    const resposta = await fetch(`${API_URL}/customers`);

    if(!resposta.ok) {
        throw new Error("Erro ao listar clientes");
    }

    return resposta.json();
}