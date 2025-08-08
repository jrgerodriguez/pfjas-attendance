import mongoose from "mongoose";
const { Schema } = mongoose;

const participantSchema = new Schema({
  nombres: String,
  apellidos: String,
  fechaDeNacimiento: String,
  dui: String,
  sexo: String,
  departamento: String,
  estaca: String,
  barrio: String,
  telefono: String,
  tallaCamisa: String,
  email: {
    type: String,
    set: (e) => (typeof e === 'string' ? e.trim() : e),
    lowercase: true,
  },
  contactoEmergencia: String,
  instituto: Boolean,
  condicionFisicaOMedica: Boolean,
  condicionFisicaOMedicaComentario: String,
  alergia: Boolean,
  alergiaComentario: String,
  medicamento: Boolean,
  medicamentoComentario: String,
  queEsperaAprender: String,
  comentarioStaff: String,
  qrToken: { type: String, unique: true },
  qrEnviado: { type: Boolean, default: false },
  scanned: { type: Boolean, default: false },
  scannedAt: { type: Date, default: null },
});

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
