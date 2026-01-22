import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { EnvironmentError } from "infra/errors";

async function hash(password) {
  const rounds = getNumberOfRoutes();
  return await bcryptjs.hash(passwordWithPepper(password), rounds);
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(
    passwordWithPepper(providedPassword),
    storedPassword,
  );
}

function getNumberOfRoutes() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function passwordWithPepper(password) {
  if (!process.env.PEPPER_OF_PASSWORD) {
    throw new EnvironmentError({
      message:
        "A variavel de ambiente 'PEPPER_OF_PASSWORD' nao esta criada ou configurada corretamente.",
      action:
        "Verifique se esta variavel esta criada ou configurada no seus sistema.",
    });
  }

  return crypto
    .createHmac("sha256", process.env.PEPPER_OF_PASSWORD)
    .update(password)
    .digest("hex");
}

const password = {
  hash,
  compare,
};

export default password;
