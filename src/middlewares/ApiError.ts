export class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }

    static badRequest(message: string) {
        return new ApiError(400, message);
    }
    static unauthorized(message = "Authentication required") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Access denied") {
        return new ApiError(403, message);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }
    static conflict(message: string) {
        return new ApiError(409, message);
    }
}