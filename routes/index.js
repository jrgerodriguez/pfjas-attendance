import express from "express";
import {registrarAsistencia} from "../controllers/index.js"

const router = express.Router();

router.get("/registrar", registrarAsistencia);

export default router