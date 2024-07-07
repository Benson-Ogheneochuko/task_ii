import { pgPool, pgClient, sequelize } from './postgressConfig.js';

let db;
export async function connectPgPool() {
  try {
    const res = await pgPool.query('SELECT NOW()');
    console.log('PgPool connected:', res.rows[0].now);
    return pgPool;
  } catch (err) {
    console.error('PgPool connection error:', err);
    throw err;
  }
}

export async function connectPgClient() {
  try {
    await pgClient.connect();
    const res = await pgClient.query('SELECT NOW()');
    console.log('PgClient connected:', res.rows[0].now);
    return pgClient;
  } catch (err) {
    console.error('PgClient connection error:', err);
    throw err;
  }
}

export async function connectSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
    return sequelize;
  } catch (err) {
    console.error('Unable to connect to the database with Sequelize:', err);
    throw err;
  }
}

export async function connnectDatabase(type = 'sequelize') {
  switch (type) {
    case 'sequelize':
      db = await connectSequelize();
      break;
    case 'pool':
      db = await connectPgPool();
      break;
    case 'pgClient':
      db = await connectPgClient();
      break;
    default:
      throw new Error('Invalid connection type');
  }

  return db
}

export const closeDatabase = async () => {
  try {
    await pgPool.end();
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

export const dbMiddleWare=(req, res, next)=>{
  if(!db) {
    return next(new Error(''))
  }
  req.db = db
  next()
}

const dbCLients= {
  connnectDatabase, connectPgClient, connectPgPool, connectSequelize, closeDatabase, dbMiddleWare
}

export default dbCLients