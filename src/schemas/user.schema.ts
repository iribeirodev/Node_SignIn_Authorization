/**
 * Validação de input de usuários
 */

import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Nome deve ser informado." }),
    email: string({ required_error: "Email deve ser informado." }).email(
      "Invalid email"
    ),
    password: string({ required_error: "Senha deve ser informada." })
      .min(8, "A senha deve conter mais que 8 caracteres.")
      .max(32, "A senha deve ser menor que 32 caracteres."),
    passwordConfirm: string({ required_error: "Confirme novamente a senha." })
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "As senhas não conferem."
  }),
})

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "E-mail deve ser informado." }).email(
      "E-mail ou senha inválidos."
    ),
    password: string({ required_error: "Senha deve ser informada." }).min(
      8,
      "E-mail ou senha inválidos."
    )
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"]
