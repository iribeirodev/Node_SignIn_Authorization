import { omit, get } from "lodash"
import { FilterQuery, QueryOptions } from "mongoose"
import config from "config"
import { DocumentType } from "@typegoose/typegoose"
import userModel, { User } from "../model/user.model"
import { excludedFields } from "../controllers/auth.controller"
import { signJwt } from "../infra/jwt"
import redisClient from "../infra/database/connectRedis"

// Criar usuário
export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input)
  return omit(user.toJSON(), excludedFields)
}

// Buscar usuário por Id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean()
  return omit(user, excludedFields)
}

// Retornar usuários
export const findAllUsers = async () => {
  return await userModel.find()
}

// Encontrar usuário por campo específico
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select("+password")
}

// Criar token de acesso com tempo de expiração
export const signToken = async (user: DocumentType<User>) => {
  const access_token = signJwt(
    { sub: user._id },
    {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`
    }
  )

  // Criar sessão com informação de usuário por Id no Redis
  redisClient.set(user._id, JSON.stringify(user), {
    EX: 60 * 60
  })

  // Retornar token de acesso
  return { access_token }
}
