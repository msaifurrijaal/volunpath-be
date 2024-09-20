export class ResponseError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export interface HttpErrorProps {
  message?: string;
}

export class Error401 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(401, props?.message ?? 'Unauthorized');
  }
}

export class Error400 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(400, props?.message ?? 'Bad request');
  }
}

export class Error403 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(403, props?.message ?? 'Forbidden');
  }
}

export class Error500 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(500, props?.message ?? 'Internal server error');
  }
}

export class Error404 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(404, props?.message ?? 'Not found');
  }
}

export class Error402 extends ResponseError {
  constructor(props?: HttpErrorProps) {
    super(402, props?.message ?? 'Payment required');
  }
}
