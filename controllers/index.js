import model from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

// Registra asistencia o marca si ya el qr fue escaneado o es invalido
async function registrarAsistencia(req, res) {
  const token = req.query.token;

  try {
    const participante = await model.Participant.findOne({ qrToken: token });

    if (!participante) {
      return res.redirect("/scan-fail.html");
    }

    if (participante.scanned) {
      return res.redirect("/already-scanned.html");
    }

    participante.scanned = true;
    await participante.save();

    return res.redirect("/scan-success.html");
  } catch (error) {
    console.error("Error confirming attendance:", error);
    return res.status(500).send("Internal Server Error");
  }
}

// Solo registra un nuevo lider en la base de datos
async function crearUsuarioLider(req, res) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newLeader = {
      email,
      password: hashedPassword,
    };

    await model.Leader.insertOne(newLeader);
    res.status(201).json({ message: "The new user has been successfully created." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
        message: "An unexpected error occurred while creating the user.",
      });
  }
}

async function iniciarSesion(req, res) {
  const {email, password} = req.body

  try {
  const leaderData = await model.Leader.findOne({email})

  if(!leaderData) {
    return res.status(404).json({message: 'Este correo no esta registrado.'})
  }

  const isMatch = await bcrypt.compare(password, leaderData.password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Contraseña incorrecta.' });
  }

  // Convertir document mongo a objeto plano
  const leader = leaderData.toObject();
  delete leader.password;

  const payload = {
    id: leader._id,
    email: leader.email
  };

  const oneHour = 60 * 60 * 1000;
  const twoHours = oneHour * 2;

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '2h'
  })

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: twoHours,
    sameSite: 'strict' 
  })

  return res.status(200).json({ message: 'Login Exitoso.'})

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

const controllers = { registrarAsistencia, crearUsuarioLider, iniciarSesion };
export default controllers;