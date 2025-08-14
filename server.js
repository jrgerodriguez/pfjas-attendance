import express from "express";
import connectDB from "./db/connection.js";
import routes from './routes/index.js'
import cors from "cors";
import cookieParser from 'cookie-parser';

// VARIABLES
const app = express();

const PORT = 5500;

// VIEWS
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// ROUTES AND CONTROLLERS
app.use("/", routes)


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