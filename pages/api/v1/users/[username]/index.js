import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/users.js";

const router = createRouter();

router.get(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);
  return response.status(200).json(userFound);
}
