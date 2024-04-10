class AuthError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
        this.errorName="Auth Error"
        Error.captureStackTrace(this)
    }
}

class ValidationError extends Error{
    constructor({message,...rest}){
        super(message)
        this.errorDetails={...rest}
        this.errorName="Validation Error"
        this.statusCode=400
        Error.captureStackTrace(this)
    }
}
class APIError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
        Error.captureStackTrace(this)
    }
}




module.exports={AuthError,APIError,ValidationError}