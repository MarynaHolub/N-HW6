import mysql from 'mysql2/promise';
import 'dotenv/config';

export const dbConfig = {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true, // Если все соединения заняты, то запрос ждет в очереди и не падает
    connectionLimit: 10, // Максимум 10 соединений
    queueLimit: 0, // Очередь ожидания без ограничения
});

export async function checkConnection() {
    const connection = await pool.getConnection();
    console.log(`Connected to MySQL database "${dbConfig.database}"`);
    connection.release()
}

export default pool