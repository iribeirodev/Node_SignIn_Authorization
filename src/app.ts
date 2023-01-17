import express, { Request, Response, NextFunction } from "express"
import config from "config"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./infra/database/connectMongo"
import userRoute from "./routes/user.route"
import authRoute from "./routes/auth.route"

require("dotenv").config()

const app = express()

const port = config.get<number>("port")
app.listen(port, () => {
    console.log(`⚡ Servidor express rodando na porta ${port}.`)
    connectDB()
});

/**
 * MIDDLEWARE
 */
app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())
if (process.env.NODE_ENV === "development") app.use(morgan("dev"))
app.use(
    cors({
        origin: config.get<string>("origin"),
        credentials: true
    })
)

/**
 * ROTAS
 */
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.get("/healthcheck", (_: Request, reply: Response, next: NextFunction) => {
    reply.status(200).json({
        status: "success",
        message: "💗 Servidor em execução."
    })
})

// Rotas desconhecidas
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`❓ Rota ${req.originalUrl} não encontrada.`) as any
    err.statusCode = 404
    next(err)
})

/**
 * HANDLER DE ERRO GLOBAL
 */
app.use((err: any, req: Request, reply: Response, next: NextFunction) => {
    err.status = err.status || 'error'
    err.statusCode = err.statusCode || 500

    reply.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})