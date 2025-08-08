import xlsx from 'xlsx';
import connectDB from './db/connection.js';
import mongoose from 'mongoose';
import Participant from './models/Participant.js';
import { randomBytes } from "crypto";

async function insertToMongo() {
    await connectDB();

// Load file
const workbook = xlsx.readFile('./inscritos2.xlsx')

// Get first sheet
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = xlsx.utils.sheet_to_json(worksheet)

// Map the data to match the file columns
const mappedData = data.map(element => ({
    nombres: element['nombres'] || '',
    apellidos: element['apellidos'] || '',
    fechaDeNacimiento: element['fecha de nacimiento'] || '',
    dui: element['numero de dui']?.toString() || '',
    sexo: element['sexo'] || '',
    departamento: element['departamento'] || '',
    estaca: element['estaca'] || '',
    barrio: element['barrio'] || '',
    telefono: element['telefono']?.toString() || '',
    tallaCamisa: element['talla de camisa'] || '',
    email: element['email'] || '',
    contactoEmergencia: element['contacto emergencia']?.toString() || '',
    instituto: (element['inscrito a instituto?'] || '').toLowerCase() === 'si',
    condicionFisicaOMedica: (element['padece alguna condicion fisica o medica?'] || '').toLowerCase() === 'si',
    condicionFisicaOMedicaComentario: element['si responde si especifica que condicion'] || '',
    alergia: (element['alergia?'] || '').toLowerCase() === 'si',
    alergiaComentario: element['si responde si especifica que tipo de alergia'] || '',
    medicamento: (element['tomas medicamento??'] || '').toLowerCase() === 'si',
    medicamentoComentario: element['si responde si especifica que medicamento'] || '',
    queEsperaAprender: element['que esperas aprender?'] || '',
    comentarioStaff: element['comentario para el staff'] || '',
    qrToken: randomBytes(16).toString("hex")
}))

// Insert the info to Mongo using the mongoose schema
    try {
        await Participant.insertMany(mappedData);
        console.log(`✅ ${mappedData.length } elementos guardados con exito`)
    } catch (error) {
        console.error('❌ Error al guardar:', error)
    }

    mongoose.connection.close();
}

insertToMongo();