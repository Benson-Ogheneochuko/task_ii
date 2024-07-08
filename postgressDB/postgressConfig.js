import pg from 'pg'
import { Sequelize } from 'sequelize'
import { UserModel } from '../models/UserModel.js'
import { OrganizationModel } from '../models/OrganizationModel.js'
import { UsersOrganizationsModel } from '../models/UsersOrganizationsModel.js'

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_CA } = process.env
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: DB_CA
    }
  },
  logging: console.log // This adds logging
})
async function initializeDatabase() {
  try {
    // Initialize models
    UserModel.initialize(sequelize)
    OrganizationModel.initialize(sequelize)
    UsersOrganizationsModel.initialize(sequelize)
    console.log('Models initialized')

    // Set up associations
    UserModel.associate({ OrganizationModel, UsersOrganizationsModel })
    OrganizationModel.associate({ UserModel, UsersOrganizationsModel })
    UsersOrganizationsModel.associate({ UserModel, OrganizationModel })
    console.log('Associations set up')

    // Sync the models with the database
    await sequelize.sync({ force: false })
    console.log('Database synchronized')
  } catch (error) {
    console.log('Error occurred:\n', error)
  }
}

initializeDatabase()

const dbClients = { sequelize }
export default dbClients