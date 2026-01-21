import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
} from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandle(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.status_code).json(error);
  }

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
