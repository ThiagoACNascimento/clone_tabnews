import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUserName(userInputValues.username);
  await hashPassowordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function findOneById(userID) {
  const userFound = await runSelectQuery(userID);
  return userFound;

  async function runSelectQuery(userID) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1
        LIMIT 
          1
      ;`,
      values: [userID],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado nao foi encontrado no sistema.",
        action: "Verifique se o id esta digitado corretamente.",
      });
    }

    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT 
          1
      ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado nao foi encontrado no sistema.",
        action: "Verifique se o username esta digitado corretamente.",
      });
    }

    return result.rows[0];
  }
}

async function findOneByEmail(email) {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email) {
    const result = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        LIMIT 
          1
      ;`,
      values: [email],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado nao foi encontrado no sistema.",
        action: "Verifique se o email esta digitado corretamente.",
      });
    }

    return result.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("username" in userInputValues) {
    await validateUniqueUserName(userInputValues.username);
  }

  if ("password" in userInputValues) {
    await hashPassowordInObject(userInputValues);
  }

  const userWithNewValues = {
    ...currentUser,
    ...userInputValues,
  };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });
    return results.rows[0];
  }
}

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado ja esta sendo utilizado.",
      action: "Utilize outro email para realizar esta operacao.",
    });
  }
}

async function validateUniqueUserName(username) {
  const result = await database.query({
    text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
      `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado ja esta sendo utilizado.",
      action: "Utilize outro username para realizar esta operacao.",
    });
  }
}

async function hashPassowordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneById,
  findOneByUsername,
  update,
  findOneByEmail,
};

export default user;
