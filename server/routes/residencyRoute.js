import express from "express";
import { createResidency, getAllresidencies, getResidency } from "../controllers/resdCntrl.js";
const router = express.Router(); 

router.post("/create", createResidency)
router.get("/allresd", getAllresidencies)
router.get("/:id", getResidency)
export {router as residencyRoute}