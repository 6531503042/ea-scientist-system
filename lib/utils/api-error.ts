export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = "Resource not found") {
        super(404, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = "Bad request", details?: any) {
        super(400, message, details);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = "Forbidden") {
        super(403, message);
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string = "Internal server error") {
        super(500, message);
    }
}
