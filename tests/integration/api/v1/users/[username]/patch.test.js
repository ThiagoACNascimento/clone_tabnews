import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "models/users";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With unique 'username'", async () => {
      const createdUser1 = await orchestrator.createUser();

      const userUpdateResponse = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );

      expect(userUpdateResponse.status).toBe(403);

      const responseBody = await userUpdateResponse.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        action: 'Verifique se o seu usuario possui a feature "update:user"',
        message: "Voce nao possui permissao para executar esta acao.",
        status_code: 403,
      });
    });
  });

  describe("Default user", () => {
    test("With noneexistent 'username'", async () => {
      const createdUser = await orchestrator.createUser();
      await orchestrator.activateUser(createdUser.id);
      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
        {
          method: "PATCH",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado nao foi encontrado no sistema.",
        action: "Verifique se o username esta digitado corretamente.",
        status_code: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "user1",
      });

      const createdUser2 = await orchestrator.createUser({
        username: "user2",
      });
      await orchestrator.activateUser(createdUser2.id);
      const sessionObject2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject2.token}`,
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado ja esta sendo utilizado.",
        action: "Utilize outro username para realizar esta operacao.",
        status_code: 400,
      });
    });

    test("With `userB` target 'userA'", async () => {
      await orchestrator.createUser({
        username: "userA",
      });

      const createdUser2 = await orchestrator.createUser({
        username: "userB",
      });
      await orchestrator.activateUser(createdUser2.id);
      const sessionObject2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch("http://localhost:3000/api/v1/users/userA", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${sessionObject2.token}`,
        },
        body: JSON.stringify({
          username: "userC",
        }),
      });

      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Voce nao possui permissao para atualizar outro usuario.",
        action:
          "Verifique se voce possui a feature necessaria para atualizar outro usuario.",
        status_code: 403,
      });
    });

    test("With duplicated 'email'", async () => {
      await orchestrator.createUser({ email: "email1@gmail.com" });

      const createdUser2 = await orchestrator.createUser({
        email: "email2@gmail.com",
      });

      await orchestrator.activateUser(createdUser2.id);
      const sessionObject2 = await orchestrator.createSession(createdUser2.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject2.token}`,
          },
          body: JSON.stringify({
            email: "email1@gmail.com",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado ja esta sendo utilizado.",
        action: "Utilize outro email para realizar esta operacao.",
        status_code: 400,
      });
    });

    test("With unique 'username'", async () => {
      const createdUser1 = await orchestrator.createUser();
      await orchestrator.activateUser(createdUser1.id);
      const sessionObject1 = await orchestrator.createSession(createdUser1.id);

      const userUpdateResponse = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject1.token}`,
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );

      expect(userUpdateResponse.status).toBe(200);

      const responseBody = await userUpdateResponse.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: createdUser1.email,
        features: ["create:session", "read:session", "update:user"],
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique 'email'", async () => {
      const createdUser1 = await orchestrator.createUser();
      await orchestrator.activateUser(createdUser1.id);
      const sessionObject1 = await orchestrator.createSession(createdUser1.id);

      const userUpdateResponse = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject1.token}`,
          },
          body: JSON.stringify({
            email: "uniqueEmail2@gmail.com",
          }),
        },
      );

      expect(userUpdateResponse.status).toBe(200);

      const responseBody = await userUpdateResponse.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createdUser1.username,
        email: "uniqueEmail2@gmail.com",
        features: ["create:session", "read:session", "update:user"],
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      const createUser1 = await orchestrator.createUser();
      await orchestrator.activateUser(createUser1.id);
      const sessionObject = await orchestrator.createSession(createUser1.id);

      const userUpdateResponse = await fetch(
        `http://localhost:3000/api/v1/users/${createUser1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );

      expect(userUpdateResponse.status).toBe(200);

      const responseBody = await userUpdateResponse.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: createUser1.username,
        email: createUser1.email,
        features: ["create:session", "read:session", "update:user"],
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const userInDatabase = await user.findOneByUsername(createUser1.username);
      const correctPasswordMatch = await password.compare(
        "newPassword2",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "newPassword1",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });

  describe("Privileged user", () => {
    test("With `update:user:others` targeting `defaultUser`", async () => {
      const defaultUser = await orchestrator.createUser();

      const privilegedUser = await orchestrator.createUser();
      await orchestrator.activateUser(privilegedUser.id);
      await orchestrator.addFeaturesToUser(privilegedUser.id, [
        "update:user:others",
      ]);
      const sessionObject = await orchestrator.createSession(privilegedUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${defaultUser.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionObject.token}`,
          },
          body: JSON.stringify({
            username: "AlteradoPorPrivilegiado",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: defaultUser.id,
        username: "AlteradoPorPrivilegiado",
        email: defaultUser.email,
        features: defaultUser.features,
        password: responseBody.password,
        created_at: defaultUser.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });
  });
});
