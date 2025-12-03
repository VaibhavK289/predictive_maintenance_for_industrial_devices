import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import sensorRoutes from "./routes/sensor.route.js";
import csvRoutes from "./routes/csv.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Routes
app.use('/api', sensorRoutes);
app.use('/csv', csvRoutes);

app.get('/', (req, res) => {
	res.json({ message: "Sensors" });
  });

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
});
