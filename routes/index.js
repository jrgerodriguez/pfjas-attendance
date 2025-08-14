import express from "express";
import controller from "../controllers/index.js"
import checkJWT from "../middlewares/index.js";

const router = express.Router();

router.get("/registrar", checkJWT, controller.registrarAsistencia);

router.post("/crearUsuarioLider", controller.crearUsuarioLider)

router.post("/iniciar-sesion", controller.iniciarSesion)

export default router