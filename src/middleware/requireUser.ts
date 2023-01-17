import { NextFunction, Request, Response } from "express"
import AppError from "../infra/appError"

export const requireUser = (
  req: Request,
  reply: Response,
  next: NextFunction
) => {
  try {
    const user = reply.locals.user
    if (!user)
      return next(new AppError("Invalid token or session has expired", 401))

    next()
  } catch (err: any) {
    next(err)
  }
}