/**
 * Verifica se a função do usuário existe na matriz permissionRoles. 
 * Se a função estiver na matriz, isso significa que o usuário tem permissão para executar essa ação, 
 * caso contrário, ocorrerá um erro.
 */
import { NextFunction, Request, Response } from "express"
import AppError from "../infra/appError"

export const restrictTo =
    (...allowedRoles: string[]) =>
        (_: Request, reply: Response, next: NextFunction) => {
            const user = reply.locals.user
            if (!allowedRoles.includes(user.role)) {
                return next(
                    new AppError("Você não está autorizado a executar essa ação.", 403)
                )
            }

            next()
        }