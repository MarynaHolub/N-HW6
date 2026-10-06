import pool from './db.js';

const createProductsTable = async () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )
    `;
  await pool.execute(sql);
  console.log('Table "products" created successfully');
};

createProductsTable()
  .catch((error) => {
    console.error('Error creating table:', error);
  })
  .finally(() => {
    pool.end;
  });
