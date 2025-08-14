import xlsx from 'xlsx';
import connectDB from './db/connection.js';
import mongoose from 'mongoose';
import model from './models/index.js';

async function generateReport() {
    try {
        
        connectDB();

        const sinEmail = await model.Participant.find({
          $or: [
            { email: { $exists: false } },
            { email: { $eq: "" } },
            { email: { $not: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } } },
          ],
        }).limit(100);


        if(!sinEmail.length) {
            console.log("🎉 Todos los participantes tienen email.")
            mongoose.connection.close();
            return;
        }

        // Crear los datos como un array de objetos
        const data = sinEmail.map((p) => ({
          Nombres: p.nombres,
          Apellidos: p.apellidos,
          Barrio: p.barrio,
          Estaca: p.estaca,
          Telefono: p.telefono,
          ID: p._id.toString(),
        }));

        // Crear un workbook y una hoja
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data)

        // Agregar hoja al workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sin Email");

        // Escribir el archivo
        xlsx.writeFile(workbook, "participantes_sin_email.xlsx");

        console.log("📄 Reporte generado: participantes_sin_email.xlsx");
        mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error al crear reporte:', error)
    }
}

generateReport();