import fs from 'fs';
import csv from 'csv-parser';
import { recordExists, insertRecord } from '../db/queries.js';

async function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const recordsToInsert = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        if (Object.keys(row).length === 0 || !row.type_h) {
          console.warn("Skipping empty row:", row);
          return;
        }

        console.log("Parsed Row:", row); // Debugging output

        if (!(await recordExists(row))) {
          await insertRecord(row);
          console.log("New record inserted");
        } else {
          console.log("Record already exists");
        }
      })
      .on('end', async () => {
        console.log(`Processing complete.`);
        resolve({ message: "CSV processing complete", newRecords: recordsToInsert.length });
      })
      .on('error', (err) => {
        console.error("Error reading CSV file:", err);
        reject({ error: "Failed to process CSV file" });
      });
  });
}

export default processCSV;
