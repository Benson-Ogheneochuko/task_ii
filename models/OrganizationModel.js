import { DataTypes, Model } from "sequelize"
import { v4 as uuidv4 } from 'uuid'

export const createOrganizationSchema = (DataTypes) => ({
  orgId: {
    type: DataTypes.STRING,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
})

export class OrganizationModel extends Model {
  static initialize(sequelize) {
    return super.init(createOrganizationSchema(DataTypes), {
      sequelize,
      modelName: "Organization",
      tableName: "organizations",
      timestamps: true,
    })
  }

  static associate(models) {
    OrganizationModel.belongsToMany(models.UserModel, { 
      through: models.UsersOrganizationsModel,
      foreignKey: 'orgId'
    })
  }
}

export default OrganizationModel
