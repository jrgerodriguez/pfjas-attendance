import express from 'express';
const app = express();
const router = express.Router();

const PORT = 5500;

app.get("/registrar", (req, res) => {
    const token = req.query.token
    res.json({token: token})
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})