import express from 'express';
import 'dotenv/config';
import pool from './db.js';

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

//------------
app.get('/', (_req, res, next) => {
  try {
    res.send('Hello, World!');
  } catch (error) {
    next(error);
  }
});

app.get('/products', async (req, res, next) => {
  try {
    const [products] = await pool.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//-------------
app.post('/', (req, res, next) => {
  try {
    //  валидация. Если не передать name, MySQL отклонит вставку из-за NOT NULL, и клиент получит 500 с текстом SQL-ошибки вместо понятного 400
    if (!req.body || Object.keys(req.body).length === 0) {
      const error = new Error('No data received');
      error.status = 400;
      throw error;
    }
    console.log(req.body);
    res.send('Data is received');
  } catch (error) {
    next(error);
  }
});

app.post('/products', async (req, res, next) => {
  try {
    //  валидация. Если не передать name, MySQL отклонит вставку из-за NOT NULL, и клиент получит 500 с текстом SQL-ошибки вместо понятного 400
    if (!req.body || Object.keys(req.body).length === 0) {
      const error = new Error('No data received');
      error.status = 400;
      throw error;
    }

    const { name, price } = req.body;
    const numericPrice = Number(price)

    if(!Number.isFinite(numericPrice || numericPrice < 0)){  // isFinite() - Является ли значение обычным конечным числом
      const error = new Error('Price must be a valid positive number')
      error.status = 400;
      throw error;
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      [name, price],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price,
    });
  } catch (error) {
    next(error);
  }
});

//-------------
// если после всех маршрутов, данного маршрута нет, то создаем ошибку

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

//------------

app.use((error, req, res, next) => {
 
  const status = error.status;
   if(status === 500){
    console.error(error.stack); // Если 500 - внутренняя ошибка сервера → показать разработчику подробный stack
   }

   // определяет, что отправить клиенту:Если это 500 → скрыть внутреннюю информацию.Если это 400/404 → можно отправить error.message
  res.status(status).json({error: status === 500 ? 'Internal Server Error' : error.message })
    
  });


app.listen(PORT, () => {
  console.log(`Server connecting at http://localhost:${PORT}`);
});
