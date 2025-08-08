import express from "express";
import connectDB from "./db/connection.js";
import Participant from "./models/Participant.js";

// VARIABLES
const app = express();
const router = express.Router();

const PORT = 5500;

// VIEWS
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES AND CONTROLLERS
app.get("/registrar", async (req, res) => {
  const token = req.query.token;

  try {

    const participante = await Participant.findOne({ qrToken: token });

    if (!participante) {
        return res.redirect('/scan-fail.html')
    }

    if (participante.scanned) {
        return res.redirect('/already-scanned.html'); 
    }

    participante.scanned = true;
    await participante.save();
    
  } catch (error) {
    console.error('Error confirming attendance:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// START SERVER
async function runServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ App listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Connection to database failed:", error.message);
    process.exit(1); 
  }
}

runServer();