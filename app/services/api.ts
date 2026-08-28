const API_URL = "https://analise-emprestimos.onrender.com";

export async function listarClientes() {
    const resposta = await fetch(`${API_URL}/customers`);

    if(!resposta.ok) {
        throw new Error("Erro ao listar clientes");
    }

    return resposta.json();
}