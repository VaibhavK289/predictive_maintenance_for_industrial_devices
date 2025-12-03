import express from 'express';
import processCSV from '../controllers/csvDB.controller.js';

const router = express.Router();

router.post('/upload', async (req, res) => {
  try {
    const filePath = 'sensor_data.csv'; // Change this if needed
    await processCSV(filePath);
    res.status(200).json({ message: 'CSV processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
