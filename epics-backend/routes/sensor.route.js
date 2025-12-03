import express from "express";
import { getSensorData } from "../controllers/sensor.controller.js";

const router = express.Router();

router.get("/", getSensorData);

export default router;