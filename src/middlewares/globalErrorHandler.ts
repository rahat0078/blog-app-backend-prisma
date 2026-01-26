import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";

    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errorMessage = "Missing fields or Incorrect field type";
    }

    res.status(statusCode)
    res.json({
        message: errorMessage,
        error: err
    }) 
}


export default errorHandler;