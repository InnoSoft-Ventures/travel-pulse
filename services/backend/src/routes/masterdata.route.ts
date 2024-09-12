import express from "express";
import { processCountries } from "../controllers/masterdata.controller";

const router = express.Router();

router.post("/parse", processCountries);

export default router;
