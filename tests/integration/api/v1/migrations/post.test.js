import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Voce nao possui permissao para executar esta acao.",
          action:
            'Verifique se o seu usuario possui a feature "create:migration"',
          status_code: 403,
        });
      });
    });
  });

  describe("Default user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "ForbiddenError",
          message: "Voce nao possui permissao para executar esta acao.",
          action:
            'Verifique se o seu usuario possui a feature "create:migration"',
          status_code: 403,
        });
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      test("With `create:migraion`", async () => {
        const createdUser = await orchestrator.createUser();
        await orchestrator.activateUser(createdUser.id);
        await orchestrator.addFeaturesToUser(createdUser.id, [
          "create:migration",
        ]);
        const sessionObject = await orchestrator.createSession(createdUser.id);
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );

        expect(response.status).toBe(200);

        const response1Body = await response.json();

        expect(Array.isArray(response1Body)).toBe(true);
      });
    });
  });
});
