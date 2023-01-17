import { createClient } from 'redis'

const redisURL = "redis://localhost:6379"
const redisClient = createClient({
    url: redisURL
})

const connectToRedis = async () => {
    try {
        await redisClient.connect()
        console.log('✅ Redis Conectado.')
    } catch (error: any) {
        console.log(`❌ Erro de database: ${error.message}`)
        // Chamar a função de conexão com o banco a cada 5 seg caso falhe.
        setTimeout(connectToRedis, 5000)
    }
}

connectToRedis()

redisClient.on('error', err => console.log(err))

export default redisClient
