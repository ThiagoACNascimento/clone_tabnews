import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method))
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });

  const dbClient = await database.getNewClient();
  try {
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    switch (request.method) {
      case "GET":
        const pendingMigrations = await migrationRunner(
          defaultMigrationOptions,
        );
        return response.status(200).json(pendingMigrations);

      case "POST":
        const migrateMigrations = await migrationRunner({
          ...defaultMigrationOptions,
          dryRun: false,
        });
        if (migrateMigrations.length > 0)
          return response.status(201).json(migrateMigrations);
        else return response.status(200).json(migrateMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
