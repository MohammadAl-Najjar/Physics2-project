import { openConnection } from './openDbConnection.js';

export async function viewAllUsers() {
    const db = await openConnection();

  try {
    const users = await db.all('SELECT * FROM users');
    console.table(users); 
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await db.close();
  }
}

viewAllUsers();