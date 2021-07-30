'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Likes.belongsTo(models.User, 
        { foreignKey: {
          allowNull: false
         
        }, onDelete:'CASCADE',
      }),
        models.Likes.belongsTo(models.Post, 
          { foreignKey: {
            allowNull: false,
               
          }, onDelete:'CASCADE',
        })
    }
  };
  Likes.init({
  
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};