import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <div>
      <h1>Status Page</h1>
      <UpdatedAT />
      <DataBase />
    </div>
  );
}

function UpdatedAT() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let lestUpdated = "Carregando...";

  if (!isLoading && data) {
    lestUpdated = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <h2>Atualizacoes do sistema:</h2>
      <p>Ultima atualizacao: {lestUpdated}</p>
    </>
  );
}

function DataBase() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let [databaseMaxConnections, databaseOpenedConnections, databaseVersion] =
    Array(4).fill("Carregando...");

  if (!isLoading && data) {
    databaseMaxConnections = data.dependencies.database.max_connections;
    databaseOpenedConnections = data.dependencies.database.opened_connections;
    databaseVersion = data.dependencies.database.version;
  }

  return (
    <>
      <h2>Banco de dados</h2>
      <p>Versao: {databaseVersion}</p>
      <p>Maximo de conexoes: {databaseMaxConnections}</p>
      <p>Conexoes abertas: {databaseOpenedConnections}</p>
    </>
  );
}
