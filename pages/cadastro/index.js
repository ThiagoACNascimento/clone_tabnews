import { useState } from "react";
import DefaultLayout from "interface/DefaultLayout";

export default function RegisterPage() {
  console.log("Render register page");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const requestBody = { username, email, password };
    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 201) {
      location.href = "/cadastro/confirmar";
    }
  }

  return (
    <DefaultLayout>
      <h1>Cadastro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          Nome do usuario:
          <input
            type="text"
            value={username}
            placeholder="UserName"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>

        <div>
          Email:
          <input
            type="email"
            value={email}
            placeholder="user@gmail.com"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>

        <div>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </DefaultLayout>
  );
}
