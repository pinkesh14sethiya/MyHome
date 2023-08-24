import express from "express";
import { createResidency, getAllresidencies, getResidency } from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";
const router = express.Router(); 

router.post("/create", jwtCheck, createResidency)
router.get("/allresd", getAllresidencies)
router.get("/:id", getResidency)
export {router as residencyRoute}
