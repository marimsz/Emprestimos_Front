'use client';


export default function Home() {

  return (
    <main
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #94baeb, #a0b5cf, #ffffff)",
      padding: "50px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    }}
    >
        <h1
        style={{
          color: "#1e3a5f",
          fontSize: "36px",
          marginBottom: "10px",
        }}
        >Sistema de Análise de Empréstimos
        </h1>

        <p
        style={{
          color: "#555",
          fontSize: "18px",
          marginBottom: "40px",
        }}
        >Bem-vindo ao sistema de empréstimos.</p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
       <button
        style={{
            backgroundColor: "#1e3a5f",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => window.location.href = "/clientes"}
       >Clientes</button><br></br>

       <button
         style={{
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => window.location.href = "/analise"}
       >Análise de Empréstimo</button>
    </div>
    </main>
  );
}
