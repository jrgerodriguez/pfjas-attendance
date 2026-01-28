import mongoose from "mongoose";
const { Schema } = mongoose;

const participantSchema = new Schema({
  nombres: String,
  apellidos: String,
  fechaDeNacimiento: {
    type: Date
  },
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
  telefonoContactoEmergencia: String,
  instituto: String,
  condicionFisicaOMedica: String,
  condicionFisicaOMedicaComentario: String,
  alergia: String,
  alergiaComentario: String,
  medicamento: String,
  medicamentoComentario: String,
  queEsperaAprender: String,
  comentarioStaff: String,
  qrToken: { type: String, unique: true },
  qrEnviado: { type: Boolean, default: false },
  scanned: { type: Boolean, default: false },
  scannedAt: { type: Date, default: null },
});

const leaderSchema = new Schema({
  email: String,
  password: String
})

const Participant = mongoose.model("Participant", participantSchema);
const Leader = mongoose.model("Leader", leaderSchema)

const models = {Participant, Leader}
export default models;
