import pkg from 'pg'
import path from 'node:path'

const { Pool, types } = pkg

// Tell pg to parse PostgreSQL timestamps (OID 1114) as UTC instead of local time
types.setTypeParser(1114, str => new Date(str + "Z"));

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


export { db };