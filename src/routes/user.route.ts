import express from "express"
import { getAllUsersHandler, getMeHandler} from "../controllers/user.controller"
import { deserializeUser } from "../middleware/deserializeUser"
import { requireUser } from "../middleware/requireUser"
import { restrictTo } from "../middleware/restrictTo"

const router = express.Router()

router.use(deserializeUser, requireUser)

// Autorizado para admin
router.get("/", restrictTo("admin"), getAllUsersHandler)

// Obtém as credenciais conectadas no momento
router.get("/me", getMeHandler)

export default router
