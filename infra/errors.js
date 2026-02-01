export class InternalServerError extends Error {
  constructor({ cause, status_code }) {
    super("Um erro interno nao esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte";
    this.status_code = status_code || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Metodo nao permitido para este endpoint");
    this.name = "MethodNotAllowedError";
    this.action =
      "Verifique se o metodo HTTP enviado e valido para este endpoint";
    this.status_code = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Servico indisponivel no momento.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o servico esta disponivel";
    this.status_code = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validacao ocorreu.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente.";
    this.status_code = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Nao foi possivel encontrar esse recurso no sistema.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action || "Verifique se os parametros enviados na consulta estao certos.";
    this.status_code = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class EnvironmentError extends Error {
  constructor({ cause, message, action }) {
    super(
      message ||
        "Nao foi possivel encontrar uma variavel de ambiente no sistema.",
      {
        cause,
      },
    );
    this.name = "EnvironmentError";
    this.action =
      action ||
      "Verifique se as variaveis de ambiente estao estabelecidas de forma correta.";
    this.status_code = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Usuario nao autenticado.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Faca novamente o login para continuar";
    this.status_code = 401;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ForbiddenError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Acesso negado.", {
      cause,
    });
    this.name = "ForbiddenError";
    this.action =
      action || "Verifique as features necessarias antes de continuar.";
    this.status_code = 403;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}
