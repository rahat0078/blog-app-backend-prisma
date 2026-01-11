import { NextFunction, Request, Response } from "express";
import { UserRole } from "../enums/user_role";
import { auth as betterAuth } from "../lib/auth"

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any,
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as UserRole,
                emailVerified: session.user.emailVerified,
            };

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Verify your email first",
                });
            }

            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};


export default auth