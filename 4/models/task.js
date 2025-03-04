'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.Collection, {
        foreignKey: 'collections_id',
        as: 'collection',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }
  Task.init(
    {
      // id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      is_done: DataTypes.BOOLEAN,
      collections_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Task',
    }
  );
  return Task;
};
