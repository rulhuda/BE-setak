import { Router } from "express"
import quiz from "./quiz.js";
import auth from "./auth.js";
const routes = Router();

routes.use('/', quiz);
routes.use('/', auth);

export default routes;
