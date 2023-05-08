import { Router } from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { generateRefreshToken } from "../controllers/RefreshToken.js";
import "dotenv/config";
import { InsertScore, Login, Logout, Profile, Register } from "../controllers/Users.js";

const router = Router();

router.post('/register', Register);

router.post('/login', Login);

router.get('/tokens', generateRefreshToken);

router.get('/me', verifyToken, Profile);

router.patch('/add-score/:id', verifyToken, InsertScore);

router.delete('/logout', Logout);

export default router;