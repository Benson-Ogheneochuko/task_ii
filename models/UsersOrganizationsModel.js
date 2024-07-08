import { Model, DataTypes } from 'sequelize';

export const createUsersOrganizationsSchema = (DataTypes) => ({
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'userId'
    }
  },
  orgId: {
    type: DataTypes.STRING,
    references: {
      model: 'organizations',
      key: 'orgId'
    }
  }
});

export class UsersOrganizationsModel extends Model {
  static initialize(sequelize) {
    return super.init(createUsersOrganizationsSchema(DataTypes), {
      sequelize,
      modelName: 'UsersOrganizations',
      tableName: 'users_organizations',
      timestamps: false
    })
  }

  static associate(models) {
    UsersOrganizationsModel.belongsTo(models.UserModel, { foreignKey: 'userId' });
    UsersOrganizationsModel.belongsTo(models.OrganizationModel, { foreignKey: 'orgId' });
  }
}