import mongoose from "mongoose"
import config from "config"

const url = `mongodb://localhost:27017/UserAuthDB`

console.log('url', url)

const connectDB = async () => {
    try {
        await mongoose.connect(url)
        console.log('✅ MongoDB Conectado.')
    } catch (error: any) {
        console.log(`❌ Erro de database: ${error.message}`)
        // Chamar a função de conexão com o banco a cada 5 seg caso falhe.
        setTimeout(connectDB, 5000)
    }
}

export default connectDB
