import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.username = decoded.username;
    next()
  })
}