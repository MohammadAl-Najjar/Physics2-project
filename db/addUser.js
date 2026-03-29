import { openConnection } from "./openDbConnection.js"

const db = await openConnection();

await db.exec(`
    INSERT INTO users(name,email,password_hash,role) VALUES ("Mohammad", "hi@gmail.com", "hi", "student");    
`)

db.close()