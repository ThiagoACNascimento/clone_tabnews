import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await database.query("SHOW server_version;");
    const databaseVersionVelue = databaseVersionResult.rows[0].server_version;
    const databaseVersionVelueOnly = databaseVersionVelue
      .split(" ")[0]
      .split("(")[0]
      .trim();

    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectedResults = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const databaseOpenedConnectedValue =
      databaseOpenedConnectedResults.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionVelueOnly,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectedValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
