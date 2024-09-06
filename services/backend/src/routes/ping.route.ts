import express from "express";
import { pingController } from "../controllers/demo.controller";

const router = express.Router();

router.get("/", pingController);

export default router;
