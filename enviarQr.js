import mongoose from "mongoose";
import connectDB from "./db/connection.js";
import Participant from "./models/Participant.js";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import logger from "./logger.js";

/*
----- VARIABLES
*/  

const delay = (ms) => new Promise((res) => setTimeout(res, ms));


/*
----- FUNCIONES 
*/  

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function verifyServer(transporter) {
  try {
    await transporter.verify();
    console.log("Servidor de correo listo para enviar.");
    return true;
  } catch (err) {
    console.error("Error al conectar con el servidor de correo:", err.message);
    return false;
  }
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function createBuffer(url) {
  return QRCode.toBuffer(url)
}

/*
----- FUNCION ENVIARQR 
*/  

async function enviarQr() {

try {
  
  await connectDB();

  const data = await Participant.find({
    qrEnviado: false,
    email: {
    $exists: true,
    $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    $not: /^\s*$/
    }
  }).limit(50);


  if (!data || data.length === 0) {
    logger.info("No hay participantes para enviar correos.");
    return;
  }

  const transporter = createTransporter();
  const isVerified = await verifyServer(transporter);
  if (!isVerified) return;

  const chunkSize = 10; // cuantos correos mandar simultáneamente
  const delayBetweenChunks = 10000; // 10 segundos de pausa entre lotes

  const chunks = chunkArray(data, chunkSize);

  let correosEnviados = 0;

  for (const chunk of chunks) {
    // Enviar todos los correos del chunk en paralelo
    await Promise.all(

      chunk.map(async (participante) => {
        if (!participante.email) {
          logger.warn(`⚠️ Persona sin correo: ${participante.nombres}`);;
          return;
        }

        try {

          const bufferUrl = `https://pfjas-attendance.onrender.com/registrar?token=${participante.qrToken}`

          const qrBuffer = await createBuffer(bufferUrl);

          const mailOptions = {
            from: `<${process.env.MAIL_USER}>`,
            to: participante.email,
            subject: "Tu código QR para el Campamento JAS 2025.",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #333333;">Hola ${participante.nombres},</h2>
                <p style="font-size: 16px; color: #555555;">
                  Este es tu <strong>código QR único</strong> para el evento. Por favor, muéstralo al momento de ingresar:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <img src="cid:qrcode" alt="Código QR" style="width: 200px; height: 200px;" />
                </div>
                <p style="font-size: 14px; color: #777777;">
                  Si tienes alguna pregunta, no dudes en contactarnos. ¡Nos vemos pronto!
                </p>
              </div>
            `,
            attachments: [
              {
                filename: "qrcode.png",
                content: qrBuffer,
                cid: "qrcode",
              },
            ],
          };

          const result = await transporter.sendMail(mailOptions);

          if (result.accepted && result.accepted.includes(participante.email)) {

            await Participant.findByIdAndUpdate(participante._id, {qrEnviado: true,});
            correosEnviados++;
            logger.info(`✅ Enviado a ${participante.nombres} al correo ${participante.email}`);

          } else {
            logger.warn(`⚠️ Correo no aceptado: ${participante.email}`);
          }
        } catch (err) {
            logger.error(`❌ Error al enviar a ${participante.nombres} con correo ${participante.email}: ${err.message}`);
        }
      })
    );

    // Pausa entre chunks para no saturar
    console.log(`Pausa de ${delayBetweenChunks / 1000} segundos antes del siguiente lote...`);
    await delay(delayBetweenChunks);
  }

  console.log(`Correos enviados: ${correosEnviados}/${data.length}`);
  } catch (error) {
      logger.error("❌ Error inesperado en enviarQr:", error.message);
  } finally {
    mongoose.connection.close();
  }
} 

enviarQr();