import { Router } from 'express'
import { getChats, getComplexities } from '../controllers/ai.controller.js';

const route = Router();

route.post("/code-complexity", getComplexities);
route.post("/chat", getChats);

export default route;