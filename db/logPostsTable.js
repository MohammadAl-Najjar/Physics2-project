import { openConnection } from './openDbConnection.js';

export async function viewAllPosts() {
    const db = await openConnection();

  try {
    const posts = await db.all('SELECT * FROM posts');
    console.table(posts); 
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await db.close();
  }
}

viewAllPosts();