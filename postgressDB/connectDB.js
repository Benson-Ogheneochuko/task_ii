import { sequelize } from './postgressConfig.js';

let db;

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
    default:
      throw new Error('Invalid connection type');
  }
  return db
}

export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

export const dbMiddleWare=(req, res, next)=>{
  if(!db) {
    return next(new Error('db not instantiated'))
  }
  req.db = db
  next()
}

const dbCLients= {
  connnectDatabase, connectSequelize, closeDatabase, dbMiddleWare, sequelize
}

export default dbCLients