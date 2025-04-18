class ClientError extends Error {
    constructor(message, status) {
        super(message);
        this.message = `ClientError: ${message}`;
        this.status = status;
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message);
        this.message = `ServerError: ${message}`;
        this.status = 500;
    }
}

const globalError = (res, err) => {
    let status = err.status || 500;
    res.statusCode = status;
    return res.end(JSON.stringify({ message: err.message, status }));
};

module.exports = { ClientError, ServerError, globalError };
