import { NextFunction, Request, Response } from "express"
import { findUserById } from "../services/user.service"
import AppError from "../infra/appError"
import redisClient from "../infra/database/connectRedis"
import { verifyJwt } from "../infra/jwt"

export const deserializeUser = async (
  req: Request,
  reply: Response,
  next: NextFunction
) => {
  try {
    // Obtém o token

    let access_token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) 
      access_token = req.headers.authorization.split(" ")[1]
    else if (req.cookies.access_token) 
      access_token = req.cookies.access_token
    
    if (!access_token)
      return next(new AppError("Você não está logado.", 401))
      
    // Valida o access token
    const decoded = verifyJwt<{ sub: string }>(access_token)

    if (!decoded) 
      return next(new AppError("Token inválido ou usuário inexistente.", 401))
    
    // Valida a sessão do usuário no Redis
    const session = await redisClient.get(decoded.sub)

    if (!session) 
      return next(new AppError("Sessão expirada.", 401))
    
    // Checa usuário com token específico
    const user = await findUserById(JSON.parse(session)._id)

    if (!user) 
      return next(new AppError("Usuário com esse token não existe.", 401))

    reply.locals.user = user

    next()
  } catch (err: any) {
    next(err)
  }
}
