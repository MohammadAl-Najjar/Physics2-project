import { openConnection } from "./openDbConnection.js"

const db = await openConnection();

await db.exec(`
    DELETE FROM users WHERE id=2;    
`)


await db.close()