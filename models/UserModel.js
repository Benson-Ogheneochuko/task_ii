import {DataTypes, Model, UUIDV4 } from 'sequelize'

export const createUserSchema = (DataTypes) => ({
  userId: {
    type: DataTypes.STRING,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  }
})

export class UserModel extends Model {
  static initialize(sequelize) {
    return super.init(createUserSchema(DataTypes), {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    })
  }

  static associate(models) {
    UserModel.belongsToMany(models.OrganizationModel, { 
      through: models.UsersOrganizationsModel,
      foreignKey: 'userId'
    })
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }

  static async findByEmail(email) {
    return this.findOne({ where: { email } })
  }
}

export default UserModel

// pg extends or smthin
// static async findByIdRawSQL(pool, id) {
//   const { rows } = await pool.query('SELECT * FROM users WHERE "userId" = $1', [id])
//   return rows[0] ? new User(rows[0]) : null
// }