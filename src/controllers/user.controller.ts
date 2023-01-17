import { NextFunction, Request, Response } from "express"
import { findAllUsers } from "../services/user.service"

/**
 * Retorna as informações do perfil do usuário conectado no momento.
 */
export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user
    res.status(200).json({
      status: "success",
      data: {
        user
      }
    })
  } catch (err: any) {
    next(err)
  }
}

/**
 * Retornar ao administrador todos os usuários.
 * @param req 
 * @param res 
 * @param next 
 */
export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers()
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users
      }
    })
  } catch (err: any) {
    next(err)
  }
}
