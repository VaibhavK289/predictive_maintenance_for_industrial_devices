import { getAllData } from './queries.js';

async function main() {
  try {
    const data = await getAllData();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

main();