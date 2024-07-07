import pg from 'pg';
import fs from 'fs'
import { Sequelize } from 'sequelize';
import { UserModel } from '../models/UserModel.js'
import { OrganizationModel } from '../models/OrganizationModel.js'
import { UsersOrganizationsModel } from '../models/UsersOrganizationsModel.js';

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;
const ca= fs.readFileSync('./ca.pem').toString()

const db_config = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_NAME,
  port: parseInt(DB_PORT, 10),
  ssl: {
    rejectUnauthorized: true,
    ca
  }
}

const { Pool, Client } = pg
export const pgPool = new Pool(db_config)
export const pgClient = new Client(db_config)

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca
    }
  },
  logging: console.log // This adds logging
});
async function initializeDatabase() {
  try {
    // Initialize models
    UserModel.initialize(sequelize)
    OrganizationModel.initialize(sequelize)
    UsersOrganizationsModel.initialize(sequelize)
    console.log('Models initialized')

    // Set up associations
    UserModel.associate({ OrganizationModel, UsersOrganizationsModel });
    OrganizationModel.associate({ UserModel, UsersOrganizationsModel });
    console.log('Associations set up')

    // Sync the models with the database
    await sequelize.sync({ force: false }) // Use { force: true } to drop and recreate tables
    console.log('Database synchronized')
  } catch (error) {
    console.log('Error occurred:\n', error)
  }
}

initializeDatabase()

const dbClients = { pgPool,pgClient, sequelize }
export default dbClients