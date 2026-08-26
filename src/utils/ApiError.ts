export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Not Found") {
    return new ApiError(404, message);
  }

  static conflict(message: string = "Conflict") {
    return new ApiError(409, message);
  }
}
