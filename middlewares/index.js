import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

function checkJWT (req, res, next) {
    const token = req.cookies?.jwt

    if(!token) {
        return res.redirect('/login.html')
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login.html')
    }
}

export default checkJWT