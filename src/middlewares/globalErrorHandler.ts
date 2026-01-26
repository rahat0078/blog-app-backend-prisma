import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    
    // PrismaClientValidationError
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "Missing fields or Incorrect field type";
    }
    // PrismaClientKnownRequestError
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            errorMessage = "Required data was not found."
        }
        else if (err.code === "P2002") {
            statusCode = 400;
            errorMessage = "Duplicate key error";
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed.";
        }
        else {
            statusCode = 400;
            errorMessage = "Invalid request data."
        }

    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Something went wrong while processing your request."
    }

    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 503;
        errorMessage = "The service is temporarily unavailable. Please try again later.";
    }

    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 503;
        errorMessage = "The service is currently unavailable. Please try again later.";
    }

    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: err
    })
}


export default errorHandler;