import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

export async function openConnection() {
    return await open({
        filename: path.join('db', 'database.db'),
        driver: sqlite3.Database
    })
}