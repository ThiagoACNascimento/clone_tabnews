import { MethodNotAllowedError, InternalServerError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandle(error, request, response) {
  const publicErrorObject = new InternalServerError({
    status_code: error.status_code,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandle,
  },
};

export default controller;
