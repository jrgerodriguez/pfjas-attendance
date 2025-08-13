import express from "express";
import controller from "../controllers/index.js"

const router = express.Router();

router.get("/registrar", controller.registrarAsistencia);

export default router