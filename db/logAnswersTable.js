import { openConnection } from './openDbConnection.js';

export async function viewAllAnswers() {
    const db = await openConnection();

  try {
    const answers = await db.all('SELECT * FROM answers');
    console.table(answers); 
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await db.close();
  }
}

viewAllAnswers();