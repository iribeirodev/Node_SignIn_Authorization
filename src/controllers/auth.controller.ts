import config from "config"
import { CookieOptions, NextFunction, Request, Response } from "express"
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema"
import { createUser, findUser, signToken } from "../services/user.service"
import AppError from "../infra/appError"

// Remove os seguintes campos do response
export const excludedFields = ["password"]

// Cookie
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax"
}

// Apenas definir como seguro em produção
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  reply: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    })

    reply.status(201).json({
      status: "success",
      data: {
        user
      }
    })
  } catch (err: any) {
    if (err.code === 11000) {
      return reply.status(409).json({
        status: "fail",
        message: "E-mail não pode ser utilizado."
      })
    }
    next(err)
  }
}

export const loginHandler = async (req: Request<{}, {}, LoginUserInput>,
        reply: Response,
        next: NextFunction) => {
  try {
    // Recupera o usuário da collection
    const user = await findUser({ email: req.body.email })

    // Checa se usuário existe e a senha está correta
    if (!user || !(await user.comparePasswords(user.password, req.body.password))) 
      return next(new AppError("E-mail ou senha inválidos.", 401))

    // Gera um token de acesso
    const { access_token } = await signToken(user)

    // Envia o access token em cookie
    reply.cookie("access_token", access_token, accessTokenCookieOptions)
    reply.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    // Envia acess token no response
    reply.status(200).json({
      status: "success",
      access_token,
    })
  } catch (err: any) {
    next(err)
  }
}
