type CodeType =
  | "NotFound"
  | "BadRequest"
  | "InternalServerError"
  | "Unauthorized"
  | "Forbidden"
  | "Conflict"
  | "InputValidationError"
  | "AuthorizationError"
  | "InvalidCredentials";

class ErrorHandler extends Error {
  public statusCode: number;
  public from: string;
  public code: CodeType;
  public status: string;
  public success: boolean;
  public isOperational: boolean;
  public errors?: any;

  constructor(message: string, statusCode: number, from: string, code: CodeType, errors?: any) {
    super(message);

    this.statusCode = statusCode;
    this.from = from;
    this.code = code;
    this.status = String(statusCode).startsWith("4") ? "Client Error" : "Sever Error";
    this.success = false;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
