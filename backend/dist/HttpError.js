"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
    getJsonMessage() {
        return { status: this.status, message: this.message };
    }
}
exports.default = HttpError;
