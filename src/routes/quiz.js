import { Router } from "express";
import { Quiz } from "../controllers/Quiz.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = Router();

router.get('/quiz', verifyToken, Quiz);

export default router;