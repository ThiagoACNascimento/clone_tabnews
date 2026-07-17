import { useState } from "react";

export default function RegisterPage() {
  console.log("Render register page");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h1>Cadastro</h1>
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
    </>
  );
}
